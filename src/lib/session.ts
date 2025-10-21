'use server'

import { sha256 } from '@oslojs/crypto/sha2'
import { encodeHexLowerCase } from '@oslojs/encoding'
import { cookies } from 'next/headers'
import { cache } from 'react'

import { createClient } from '../utils/supabase/server.ts'

import type { APIUser, User } from '../types/user.ts'

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
  created_at: string
}

export interface Session {
  id: string
  userId: string
  expiresAt: Date
  createdAt: Date
}

export async function createSession(
  token: string,
  userId: string,
): Promise<Session> {
  'use server'

  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

  const now = new Date()

  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(now.getTime() + 1000 * 60 * 60),
    createdAt: now,
  }

  const supabase = createClient()

  await supabase.from('sessions').insert<APISession>({
    id: session.id,
    created_at: session.createdAt.toISOString(),
    user_id: session.userId,
    expires_at: session.expiresAt.toISOString(),
  })

  return session
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  'use server'

  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

  const supabase = createClient()

  const { data: sessionData } = await supabase
    .from('sessions')
    .select('*')
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

  const session: Session = {
    id: sessionData.id,
    userId: sessionData.user_id,
    expiresAt: new Date(sessionData.expires_at),
    createdAt: new Date(sessionData.created_at),
  }

  const user: User = {
    id: userData.id,
    createdAt: userData.created_at,
    role: userData.role,
  }

  if (Date.now() >= session.expiresAt.getTime()) {
    await supabase.from('sessions').delete().eq('id', session.id)

    return {
      session: null,
      user: null,
    }
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 30) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60)

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

  const supabase = createClient()

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
