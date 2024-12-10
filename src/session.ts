'use server'

import { sha256 } from '@oslojs/crypto/sha2'
import {
  // encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from '@oslojs/encoding'
import jwt from 'jsonwebtoken'
import { cookies, headers } from 'next/headers.js'
import { cache } from 'react'

import { createClient } from './utils/supabase/server.js'

import type { APIUser, User } from './types/user.js'

export type SessionValidationResult =
  | {
      session: Session
      user: User
    }
  | {
      session: null
      user: null
    }

export interface APISession {
  id: string
  user_id: string
  expires_at: string
  created_at?: string
  ip_address?: string
  user_agent?: {
    'user-agent': string | null
    'sec-ch-ua-mobile': string | null
    'sec-ch-ua-model': string | null
    'sec-ch-ua-platform': string | null
  }
}

export interface Session {
  id: string
  userId: string
  expiresAt: Date
  createdAt?: Date
  ipAddress?: string
  userAgent?: {
    'user-agent': string | null
    'sec-ch-ua-mobile': string | null
    'sec-ch-ua-model': string | null
    'sec-ch-ua-platform': string | null
  }
  supabaseAccessToken?: string
}

export async function createSession(
  token: string,
  userId: string,
): Promise<Session> {
  'use server'

  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  }

  const headersStore = await headers()

  const supabase = createClient({
    serviceRole: true,
  })

  await supabase.from('sessions').insert<APISession>({
    id: session.id,
    created_at: new Date().toISOString(),
    user_id: session.userId,
    expires_at: session.expiresAt.toISOString(),
    user_agent: {
      'user-agent': headersStore.get('user-agent'),
      'sec-ch-ua-mobile': headersStore.get('sec-ch-ua-mobile'),
      'sec-ch-ua-model': headersStore.get('sec-ch-ua-model'),
      'sec-ch-ua-platform': headersStore.get('sec-ch-ua-platform'),
    },
  })

  const { data: user } = await supabase
    .from('users')
    .select('email')
    .eq('id', session.userId)
    .single()

  if (user) {
    const payload = {
      aud: 'authenticated',
      exp: Math.floor(new Date(session.expiresAt).getTime() / 1000),
      sub: session.userId,
      email: user.email,
      role: 'authenticated',
    }

    session.supabaseAccessToken = jwt.sign(
      payload,
      process.env.SUPABASE_JWT_SECRET as string,
    )
  }

  return session
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  'use server'

  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

  const supabase = createClient({
    serviceRole: true,
  })

  const { data: sessionData } = await supabase
    .from('sessions')
    .select('id, user_id, expires_at')
    .eq('id', sessionId)
    .single<APISession>()

  if (sessionData === null)
    return {
      session: null,
      user: null,
    }

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', sessionData.user_id)
    .single<APIUser>()

  if (userData === null)
    return {
      session: null,
      user: null,
    }

  const payload = {
    aud: 'authenticated',
    exp: Math.floor(new Date(sessionData.expires_at).getTime() / 1000),
    sub: sessionData.user_id,
    email: userData.email,
    role: 'authenticated',
  }

  const supabaseAccessToken = jwt.sign(
    payload,
    process.env.SUPABASE_JWT_SECRET as string,
  )

  const session: Session = {
    id: sessionData.id,
    userId: sessionData.user_id,
    expiresAt: new Date(sessionData.expires_at),
    createdAt: sessionData.created_at
      ? new Date(sessionData.created_at)
      : undefined,
    ipAddress: sessionData.ip_address,
    userAgent: sessionData.user_agent,
    supabaseAccessToken,
  }

  const user: User = {
    id: userData.id,
    createdAt: userData.created_at,
    email: userData.email,
    role: userData.role,
    ...(userData.email_verified
      ? {
          emailVerified: true,
          emailVerifiedAt: new Date(userData.email_verified_at),
        }
      : {
          emailVerified: false,
          emailVerifiedAt: null,
        }),
  }

  if (Date.now() >= session.expiresAt.getTime()) {
    await supabase.from('sessions').delete().eq('id', session.id)

    return {
      session: null,
      user: null,
    }
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)

    await supabase
      .from('sessions')
      .update<Partial<APISession>>({
        expires_at: session.expiresAt.toISOString(),
      })
      .eq('id', session.id)
  }

  return {
    session,
    user,
  }
}

export async function invalidateSession(sessionId: string): Promise<void> {
  'use server'

  const supabase = createClient({
    serviceRole: true,
  })

  await supabase.from('sessions').delete().eq('id', sessionId)
}

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date,
): Promise<void> {
  'use server'

  const cookieStore = await cookies()

  cookieStore.set('session', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    path: '/',
  })
}

export async function deleteSessionTokenCookie(): Promise<void> {
  'use server'

  const cookieStore = await cookies()

  cookieStore.set('session', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  })
}

export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    'use server'

    const cookieStore = await cookies()

    const token = cookieStore.get('session')?.value ?? null

    if (token === null)
      return {
        session: null,
        user: null,
      }

    const result = await validateSessionToken(token)

    return result
  },
)
