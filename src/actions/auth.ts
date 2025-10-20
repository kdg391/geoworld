'use server'

import { hash, verify } from '@node-rs/argon2'
import { and, eq, ne } from 'drizzle-orm'
// import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { db } from '../db/index.ts'
import {
  accountsTable,
  profilesTable,
  sessionsTable,
  usersTable,
} from '../db/schema.ts'
// import {
//   createEmailVerificationRequest,
//   sendVerificationEmail,
//   setEmailVerificationRequestCookie,
// } from '../lib/email-verification.ts'
import { createMagicLinkToken } from '../lib/magic-link.ts'
import { passwordOptions } from '../lib/password.ts'
import {
  createSession,
  deleteSessionTokenCookie,
  // generateSessionToken,
  getCurrentSession,
  invalidateSession,
  setSessionTokenCookie,
} from '../lib/session.ts'
import { generateSessionToken } from '../lib/session-utils.ts'
import { sendEmail } from '../utils/email/index.ts'
import MagicLinkTemplate from '../utils/email/templates/magic-link.tsx'
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInCredentialsSchema,
  signInEmailSchema,
  signUpSchema,
} from '../utils/validations/auth.ts'

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

  await db
    .delete(sessionsTable)
    .where(
      and(eq(sessionsTable.userId, user.id), ne(sessionsTable.id, session.id)),
    )

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
      errors: z.flattenError(validated.error).fieldErrors,
    }

  const emailExists = await checkEmailExists(validated.data.email)
  console.log(emailExists)

  if (emailExists)
    return {
      errors: {
        email: ['The email already exists.'],
      },
    }

  const hashedPassword = await hash(validated.data.password, passwordOptions)

  const [user] = await db
    .insert(usersTable)
    .values({
      createdAt: new Date(),
      email: validated.data.email,
      emailVerified: false,
      emailVerifiedAt: null,
    })
    .returning()

  await db.insert(profilesTable).values({
    id: user.id,
    isPublic: true,
  })

  await db.insert(accountsTable).values({
    provider: 'credentials',
    accountId: user.id,
    userId: user.id,
    hashedPassword,
  })

  // const emailVerificationRequest = await createEmailVerificationRequest(
  //   user.id,
  //   user.email,
  // )

  // await sendVerificationEmail(
  //   emailVerificationRequest.email,
  //   emailVerificationRequest.code,
  // )
  // await setEmailVerificationRequestCookie(emailVerificationRequest)

  const sessionToken = generateSessionToken()
  const session = await createSession(sessionToken, user.id)

  await setSessionTokenCookie(sessionToken, session.expiresAt)

  // revalidatePath('/', 'layout')

  // return redirect('/verify-email')
  return { errors: null }
}

export const signInWithCredentials = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await signInCredentialsSchema.safeParseAsync({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success)
    return {
      errors: z.flattenError(validated.error).fieldErrors,
    }

  let redirectTo = '/dashboard'

  const headerStore = await headers()
  const referrer = headerStore.get('referer')

  if (referrer) {
    const next = new URL(referrer).searchParams.get('next')

    if (next) redirectTo = next
  }

  const userResult = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, validated.data.email))

  const user = userResult[0] ?? null

  if (user === null)
    return {
      errors: {
        message: 'invalid_credentials',
      },
    }

  const accountResult = await db
    .select()
    .from(accountsTable)
    .where(
      and(
        eq(accountsTable.provider, 'credentials'),
        eq(accountsTable.userId, user.id),
      ),
    )

  const account = accountResult[0] ?? null

  if (account === null)
    return {
      errors: {
        message: 'invalid_credentials',
      },
    }

  const isPwMatched = await verify(
    account.hashedPassword as string,
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
      errors: z.flattenError(validated.error).fieldErrors,
    }

  const token = await createMagicLinkToken(validated.data.email)

  const url = `${process.env.NEXT_PUBLIC_URL}/magic-link/${token}`

  await sendEmail({
    from: `GeoWorld <${process.env.RESEND_EMAIL_FROM}>`,
    to: validated.data.email,
    subject: 'Sign in to GeoWorld',
    html: MagicLinkTemplate({
      magicLinkUrl: url,
    }),
    text: `Sign in to GeoWorld: ${url}`,
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
      errors: z.flattenError(validated.error).fieldErrors,
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
      errors: z.flattenError(validated.error).fieldErrors,
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

export const checkEmailExists = async (email: string) => {
  const result = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))

  const data = result[0] ?? null

  return data !== null
}
