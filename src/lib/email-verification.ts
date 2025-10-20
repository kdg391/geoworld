'use server'

import { encodeBase32 } from '@oslojs/encoding'
import { and, eq } from 'drizzle-orm'
import { cookies } from 'next/headers'

import { db } from '../db/index.ts'
import { emailVerificationCodesTable } from '../db/schema.ts'
import { sendEmail } from '../utils/email/index.ts'
import VerifyEmailTemplate from '../utils/email/templates/verify-email.tsx'

import { generateRandomOTP } from './code.ts'
// import { ExpiringTokenBucket } from './rate-limit.ts'
import { getCurrentSession } from './session.ts'

export async function getUserEmailVerificationRequest(
  userId: string,
  id: string,
): Promise<EmailVerificationRequest | null> {
  'use server'

  const rowData = await db
    .select()
    .from(emailVerificationCodesTable)
    .where(
      and(
        eq(emailVerificationCodesTable.id, id),
        eq(emailVerificationCodesTable.userId, userId),
      ),
    )

  const row = rowData[0] ?? null

  if (row === null) return null

  return row
}

export async function createEmailVerificationRequest(
  userId: string,
  email: string,
): Promise<EmailVerificationRequest> {
  'use server'

  await deleteUserEmailVerificationRequest(userId)

  const idBytes = new Uint8Array(20)
  crypto.getRandomValues(idBytes)

  const id = encodeBase32(idBytes).toLowerCase()

  const code = generateRandomOTP()

  const now = new Date()
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 10)

  await db.insert(emailVerificationCodesTable).values({
    id,
    userId,
    code,
    email,
    createdAt: now,
    expiresAt,
  })

  const request: EmailVerificationRequest = {
    id,
    userId,
    code,
    email,
    createdAt: now,
    expiresAt,
  }

  return request
}

export async function deleteUserEmailVerificationRequest(
  userId: string,
): Promise<void> {
  'use server'

  await db
    .delete(emailVerificationCodesTable)
    .where(eq(emailVerificationCodesTable.userId, userId))
}

export async function sendVerificationEmail(
  email: string,
  code: string,
): Promise<void> {
  'use server'

  await sendEmail({
    from: `GeoWorld <${process.env.RESEND_EMAIL_FROM}>`,
    to: email,
    subject: 'Verify your email address',
    html: VerifyEmailTemplate({
      validationCode: code,
    }),
    text: `Validation code: ${code}`,
  })
}

export async function setEmailVerificationRequestCookie(
  request: EmailVerificationRequest,
): Promise<void> {
  'use server'

  const cookieStore = await cookies()

  cookieStore.set('email_verification', request.id, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: request.expiresAt,
  })
}

export async function deleteEmailVerificationRequestCookie(): Promise<void> {
  'use server'

  const cookieStore = await cookies()

  cookieStore.set('email_verification', '', {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  })
}

export async function getUserEmailVerificationRequestFromRequest(): Promise<EmailVerificationRequest | null> {
  'use server'

  const { user } = await getCurrentSession()

  if (user === null) return null

  const cookieStore = await cookies()

  const id = cookieStore.get('email_verification')?.value ?? null

  if (id === null) return null

  const request = await getUserEmailVerificationRequest(user.id, id)

  if (request === null) await deleteEmailVerificationRequestCookie()

  return request
}

export interface APIEmailVerificationRequest {
  id: string
  user_id: string
  code: string
  email: string
  created_at: string
  expires_at: string
}

export interface EmailVerificationRequest {
  id: string
  userId: string
  code: string
  email: string
  createdAt: Date
  expiresAt: Date
}
