'use server'

import { sha256 } from '@oslojs/crypto/sha2'
import {
  // encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from '@oslojs/encoding'
import { eq } from 'drizzle-orm'
import { cookies /*, headers*/ } from 'next/headers'
import { cache } from 'react'

import { db } from '../db/index.ts'
import { sessionsTable, usersTable } from '../db/schema.ts'

import type { User } from '../types/user.ts'

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
  ip_address: string | null
  user_agent: string | null
}

export interface Session {
  id: string
  userId: string
  expiresAt: Date
  createdAt: Date
  ipAddress: string | null
  userAgent: string | null
}

export async function createSession(
  token: string,
  userId: string,
): Promise<Session> {
  'use server'

  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

  // const headerStore = await headers()

  // const forwardedFor = headerStore.get('x-forwarded-for')

  // let ipAddress: string | null

  // if (forwardedFor) ipAddress = forwardedFor.split(',')[0] ?? null
  // else ipAddress = headerStore.get('x-real-ip') ?? null

  const ipAddress = null

  const now = new Date()

  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30),
    createdAt: now,
    ipAddress,
    // userAgent: headerStore.get('user-agent'),
    userAgent: null,
  }

  await db.insert(sessionsTable).values({
    id: session.id,
    createdAt: session.createdAt,
    userId: session.userId,
    expiresAt: session.expiresAt,
    ipAddress: session.ipAddress,
    userAgent: session.userAgent,
  })

  return session
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  'use server'

  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

  const sessionResult = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.id, sessionId))

  const sessionData = sessionResult[0] ?? null

  if (sessionData === null)
    return {
      session: null,
      user: null,
    }

  const userResult = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, sessionData.userId))

  const userData = userResult[0] ?? null

  if (userData === null)
    return {
      session: null,
      user: null,
    }

  const session: Session = {
    id: sessionData.id,
    userId: sessionData.userId,
    expiresAt: sessionData.expiresAt,
    createdAt: sessionData.createdAt,
    ipAddress: sessionData.ipAddress,
    userAgent: sessionData.userAgent,
  }

  const user: User = {
    id: userData.id,
    createdAt: userData.createdAt.toISOString(),
    email: userData.email,
    role: userData.role,
    ...(userData.emailVerified
      ? {
          emailVerified: true,
          emailVerifiedAt: userData.emailVerifiedAt as Date,
        }
      : {
          emailVerified: false,
          emailVerifiedAt: null,
        }),
  }

  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionsTable).where(eq(sessionsTable.id, session.id))

    return {
      session: null,
      user: null,
    }
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)

    await db
      .update(sessionsTable)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(sessionsTable.id, session.id))
  }

  return {
    session,
    user,
  }
}

export async function invalidateSession(sessionId: string): Promise<void> {
  'use server'

  await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId))
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
