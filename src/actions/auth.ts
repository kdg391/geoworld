'use server'

import { verify } from '@node-rs/argon2'
import { headers } from 'next/headers.js'
import { redirect } from 'next/navigation.js'

import { passwordOptions } from '../lib/password.js'
import {
  createSession,
  deleteSessionTokenCookie,
  // generateSessionToken,
  getCurrentSession,
  invalidateSession,
  setSessionTokenCookie,
} from '../lib/session.js'
import { generateSessionToken } from '../lib/session-utils.ts'

import { createClient } from '../utils/supabase/server.js'
import { signInSchema } from '../utils/validations/auth.js'

import type { APIAccount } from '@/types/account.ts'
import type { APIUser } from '@/types/user.ts'

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

export const signOutAllSessions = async () => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session)
    return {
      errors: {
        message: 'Unauthorized',
      },
    }

  const supabase = createClient()

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

export const signIn = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await signInSchema.safeParseAsync({
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

  const supabase = createClient()

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', process.env.ADMIN_USER_ID)
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
    .eq('user_id', user.id)
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
