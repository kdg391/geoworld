'use server'

import { hash, verify } from '@node-rs/argon2'
import { revalidatePath } from 'next/cache.js'
import { headers } from 'next/headers.js'
import { redirect } from 'next/navigation.js'

import {
  createEmailVerificationRequest,
  sendVerificationEmail,
  setEmailVerificationRequestCookie,
} from '../lib/email-verification.js'
import { createMagicLinkToken } from '../lib/magic-link.js'
import { passwordOptions } from '../lib/password.js'
import {
  createSession,
  deleteSessionTokenCookie,
  // generateSessionToken,
  getCurrentSession,
  invalidateSession,
  setSessionTokenCookie,
} from '../lib/session.js'
import { generateSessionToken } from '../lib/session-utils.js'

import { resend } from '../utils/email/index.js'
import MagicLinkTemplate from '../utils/email/templates/magic-link.js'
import { createClient } from '../utils/supabase/server.js'
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInCredentialsSchema,
  signInEmailSchema,
  signUpSchema,
} from '../utils/validations/auth.js'

import type { APIAccount } from '@/types/account.js'
import type { APIUser } from '@/types/user.js'

export const signOut = async () => {
  'use server'

  const { session } = await getCurrentSession()

  if (!session)
    return {
      errors: {
        message: 'Unauthorized',
      },
    }

  await invalidateSession(session.id)
  await deleteSessionTokenCookie()
}

export const signOutSession = async (_: unknown, formData: FormData) => {
  'use server'

  const { session } = await getCurrentSession()

  if (!session)
    return {
      errors: {
        message: 'Unauthorized',
      },
    }

  const sessionId = formData.get('session-id')

  if (sessionId) {
    await invalidateSession(sessionId.toString())

    if (session.id === sessionId) await deleteSessionTokenCookie()
  }

  return {
    errors: null,
  }
}

export const signOutAllSessions = async () => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session)
    return {
      errors: {
        message: 'Unauthorized',
      },
    }

  const supabase = createClient({
    serviceRole: true,
  })

  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('user_id', user.id)
    .neq('id', session.id)

  if (error)
    return {
      errors: {
        message: 'Something went wrong!',
      },
    }

  await invalidateSession(session.id)
  await deleteSessionTokenCookie()

  return {
    errors: null,
  }
}

export const signUpWithCredentials = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await signUpSchema.safeParseAsync({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirm-password'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  const supabase = createClient({
    serviceRole: true,
  })

  const { data: emailExists, error: emailErr } = await supabase
    .rpc('check_email_exists', {
      p_email: validated.data.email,
    })
    .returns<boolean>()

  if (emailExists)
    return {
      errors: {
        email: ['The email already exists.'],
      },
    }

  if (emailErr)
    return {
      errors: {
        email: ['Something went wrong!'],
      },
    }

  const hashedPassword = await hash(validated.data.password, passwordOptions)

  const { data: user, error: userErr } = await supabase
    .from('users')
    .insert<Partial<APIUser>>({
      created_at: new Date().toISOString(),
      email: validated.data.email,
      email_verified: false,
      email_verified_at: null,
    })
    .select()
    .single<APIUser>()

  if (userErr)
    return {
      errors: {
        message: 'Something went wrong!',
      },
    }

  const { error: profileErr } = await supabase.from('profiles').insert({
    id: user.id,
    is_public: true,
  })

  if (profileErr)
    return {
      errors: {
        message: 'Something went wrong!',
      },
    }

  const { error: accountErr } = await supabase
    .from('accounts')
    .insert<Partial<APIAccount>>({
      provider: 'credentials',
      account_id: user.id,
      user_id: user.id,
      hashed_password: hashedPassword,
    })

  if (accountErr)
    return {
      errors: {
        message: 'Something went wrong!',
      },
    }

  const emailVerificationRequest = await createEmailVerificationRequest(
    user.id,
    user.email,
  )

  await sendVerificationEmail(
    emailVerificationRequest.email,
    emailVerificationRequest.code,
  )
  await setEmailVerificationRequestCookie(emailVerificationRequest)

  const sessionToken = generateSessionToken()
  const session = await createSession(sessionToken, user.id)

  await setSessionTokenCookie(sessionToken, session.expiresAt)

  revalidatePath('/', 'layout')

  return redirect('/verify-email')
}

export const signInWithCredentials = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await signInCredentialsSchema.safeParseAsync({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  let redirectTo = '/dashboard'

  const headerStore = await headers()
  const referrer = headerStore.get('referer')

  if (referrer) {
    const next = new URL(referrer).searchParams.get('next')

    if (next) redirectTo = next
  }

  const supabase = createClient({
    serviceRole: true,
  })

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', validated.data.email)
    .single<APIUser>()

  if (user === null)
    return {
      errors: {
        message: 'invalid_credentials',
      },
    }

  const { data: account } = await supabase
    .from('accounts')
    .select('*')
    .match({
      provider: 'credentials',
      user_id: user.id,
    })
    .single<APIAccount>()

  if (account === null)
    return {
      errors: {
        message: 'invalid_credentials',
      },
    }

  const isPwMatched = await verify(
    account.hashed_password as string,
    validated.data.password,
    passwordOptions,
  )

  if (!isPwMatched)
    return {
      errors: {
        message: 'invalid_credentials',
      },
    }

  const sessionToken = generateSessionToken()
  const session = await createSession(sessionToken, user.id)

  await setSessionTokenCookie(sessionToken, session.expiresAt)

  redirect(redirectTo)
}

export const signInWithEmail = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await signInEmailSchema.safeParseAsync({
    email: formData.get('email'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  const token = await createMagicLinkToken(validated.data.email)

  const url = `${process.env.NEXT_PUBLIC_URL}/magic-link/${token}`

  await resend.emails.send({
    from: `GeoWorld <${process.env.RESEND_EMAIL_FROM}>`,
    to: validated.data.email,
    subject: 'Sign in to GeoWorld',
    react: MagicLinkTemplate({
      magicLinkUrl: url,
    }),
  })

  redirect('/')
}

export const forgotPassword = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await forgotPasswordSchema.safeParseAsync({
    email: formData.get('email'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/auth/reset-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: validated.data.email,
        }),
      },
    )

    const data = await response.json()

    if (data?.errors) throw new Error('Something went wrong!')
  } catch (err) {
    if (err instanceof Error)
      return {
        errors: {
          message: 'Something went wrong!',
        },
      }

    return {
      errors: null,
    }
  }

  redirect('/email-has-sent')
}

export const resetPassword = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await resetPasswordSchema.safeParseAsync({
    password: formData.get('password'),
    confirmPassword: formData.get('confirm-password'),
    token: formData.get('token'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/auth/reset-password/${validated.data.token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: validated.data.password,
        }),
      },
    )

    const data = await response.json()

    if (data.errors) throw new Error('Something went wrong!')
  } catch (err) {
    if (err instanceof Error)
      return {
        errors: {
          message: 'Something went wrong!',
        },
      }

    return {
      errors: null,
    }
  }

  redirect('/sign-in')
}
