'use server'

import { hash, verify } from '@node-rs/argon2'
import { revalidatePath } from 'next/cache'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

import {
  createEmailVerificationRequest,
  sendVerificationEmail,
  // setEmailVerificationRequestCookie,
} from '../email-verification.js'
import {
  createSession,
  deleteSessionTokenCookie,
  // generateSessionToken,
  getCurrentSession,
  invalidateSession,
  setSessionTokenCookie,
} from '../session.js'
import { generateSessionToken } from '../session-utils.js'

import { resend } from '../utils/email/index.js'
import { createClient } from '../utils/supabase/server.js'
import {
  changeEmailSchema,
  changePasswordSchema,
  deleteAccountSchema,
  resetPasswordSchema,
  signInCredentialsSchema,
  signInEmailSchema,
  signUpSchema,
  updatePasswordSchema,
} from '../utils/validations/auth.js'

import type { APIAccount } from '@/types/account.js'
import type { APIUser } from '@/types/user.js'

export const signOut = async () => {
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

export const signUpCredentials = async (_: unknown, formData: FormData) => {
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

  const hashedPassword = await hash(validated.data.password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  })

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
  // await setEmailVerificationRequestCookie(emailVerificationRequest)
  const cookieStore = await cookies()

  cookieStore.set('email_verification', emailVerificationRequest.id, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: emailVerificationRequest.expiresAt,
  })

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
        message: 'Email or password is incorrect.',
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
        message: 'Email or password is incorrect.',
      },
    }

  const isPwMatched = await verify(
    account.hashed_password as string,
    validated.data.password,
    {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    },
  )

  if (!isPwMatched)
    return {
      errors: {
        message: 'Email or password is incorrect.',
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

  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('email', validated.data.email)
    .single<APIUser>()

  const token = crypto.randomUUID()

  const url = `${process.env.NEXT_PUBLIC_URL}/magic-link/${token}`

  await resend.emails.send({
    from: `GeoWorld <${process.env.RESEND_EMAIL_FROM}>`,
    to: validated.data.email,
    subject: 'Sign In to GeoWorld',
    text: '',
    html: `<a href="${url}">Sign In</a>`,
  })

  if (existingUser !== null) {
    const sessionToken = generateSessionToken()
    const session = await createSession(sessionToken, existingUser.id)

    await setSessionTokenCookie(sessionToken, session.expiresAt)
  }

  const sessionToken = generateSessionToken()
  const session = await createSession(sessionToken, '')

  await setSessionTokenCookie(sessionToken, session.expiresAt)

  redirect(redirectTo)
}

export const resetPassword = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await resetPasswordSchema.safeParseAsync({
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

    if (data?.error) throw new Error('Something went wrong!')
  } catch (err) {
    if (err instanceof Error)
      return {
        errors: {
          message: 'Database Error',
        },
      }

    return {
      errors: null,
    }
  }

  redirect('/email-has-sent')
}

export const updatePassword = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await updatePasswordSchema.safeParseAsync({
    password: formData.get('password'),
    confirmPassword: formData.get('confirm-password'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/auth/update-password`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: formData.get('token'),
          password: validated.data.password,
        }),
      },
    )

    const data = await response.json()

    if (data.error) throw new Error('Something went wrong!')
  } catch (err) {
    if (err instanceof Error)
      return {
        errors: {
          message: 'Database Error',
        },
      }

    return {
      errors: null,
    }
  }

  redirect('/sign-in')
}

export const changeEmail = async (_: unknown, formData: FormData) => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in')

  if (user.role !== 'user')
    return {
      errors: {
        message: 'You cannot change your email.',
      },
    }

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  if (user.emailVerified) {
    const emailConfirmedAt = user.emailVerifiedAt.getTime()

    if (Date.now() - emailConfirmedAt < 60 * 60 * 24 * 7 * 1000)
      return {
        errors: {
          message: 'The email can be changed one week after the last change.',
        },
      }
  }

  const validated = await changeEmailSchema.safeParseAsync({
    oldEmail: user.email,
    newEmail: formData.get('email'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  const { data: emailExists, error: eErr } = await supabase
    .rpc('check_email_exists', {
      p_email: validated.data.newEmail,
    })
    .returns<boolean>()

  if (eErr)
    return {
      errors: {
        message: 'Database Error',
      },
    }

  if (emailExists)
    return {
      errors: {
        message: 'The email is already registered.',
      },
    }

  const { error } = await supabase
    .from('users')
    .update({
      email: validated.data.newEmail,
      emailVerified: null,
    })
    .eq('id', user.id)

  if (error)
    return {
      errors: {
        message: 'Database Error',
      },
    }

  return {
    errors: null,
  }
}

export const changePassword = async (_: unknown, formData: FormData) => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in')

  if (user.role !== 'user')
    return {
      errors: {
        message: 'You cannot change your password.',
      },
    }

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const validated = await changePasswordSchema.safeParseAsync({
    oldPassword: formData.get('old-password'),
    newPassword: formData.get('new-password'),
    confirmPassword: formData.get('confirm-password'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
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
        message: 'Failed to load your data.',
      },
    }

  const isPwMatched = await verify(
    account.hashed_password as string,
    validated.data.oldPassword,
  )

  if (!isPwMatched)
    return {
      errors: {
        oldPassword: ['The old password is not matched.'],
      },
    }

  const hashedPassword = await hash(validated.data.newPassword, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  })

  const { error: updatedErr } = await supabase
    .from('accounts')
    .update<Partial<APIAccount>>({
      hashed_password: hashedPassword,
    })
    .eq('user_id', user.id)

  return {
    errors: {
      message: updatedErr?.message,
    },
  }
}

export const deleteAccount = async (_: unknown, formData: FormData) => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in')

  if (user.role !== 'user')
    return {
      errors: {
        message: 'You cannot delete your account.',
      },
    }

  const validated = await deleteAccountSchema.safeParseAsync({
    password: formData.get('password'),
    confirmMessage: formData.get('confirm-message'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  const supabase = createClient({
    serviceRole: true,
  })

  const { error } = await supabase.from('users').delete().eq('id', user.id)

  if (error)
    return {
      errors: {
        message: 'Something went wrong!',
      },
    }

  await invalidateSession(session.id)
  await deleteSessionTokenCookie()

  revalidatePath('/', 'layout')
  redirect('/')
}
