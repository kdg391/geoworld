'use server'

import { hash, verify } from '@node-rs/argon2'
import { revalidatePath } from 'next/cache.js'
import { headers } from 'next/headers.js'
import { redirect } from 'next/navigation.js'

import {
  createEmailVerificationRequest,
  sendVerificationEmail,
  setEmailVerificationRequestCookie,
} from '../email-verification.js'
import { createMagicLinkToken } from '../magic-link.js'
import { passwordOptions } from '../password.js'
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
import MagicLinkTemplate from '@/utils/email/templates/magic-link.js'
import { createClient } from '../utils/supabase/server.js'
import {
  signInCredentialsSchema,
  signInEmailSchema,
  signUpSchema,
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
    passwordOptions,
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
