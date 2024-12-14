'use server'

import { encodeBase32 } from '@oslojs/encoding'
import { cookies } from 'next/headers'

import { generateRandomOTP } from './code.js'
// import { ExpiringTokenBucket } from './rate-limit.js'
import { getCurrentSession } from './session.js'

import { resend } from './utils/email/index.js'
import VerifyEmailTemplate from './utils/email/templates/verify-email.js'
import { createClient } from './utils/supabase/server.js'

export async function getUserEmailVerificationRequest(
  userId: string,
  id: string,
): Promise<EmailVerificationRequest | null> {
  'use server'

  const supabase = createClient({
    serviceRole: true,
  })

  const { data: row } = await supabase
    .from('email_verification_codes')
    .select('*')
    .match({
      id,
      user_id: userId,
    })
    .single<APIEmailVerificationRequest>()

  if (row === null) return null

  const request: EmailVerificationRequest = {
    id: row.id,
    userId: row.user_id,
    code: row.code,
    email: row.email,
    createdAt: new Date(row.created_at),
    expiresAt: new Date(row.expires_at),
  }

  return request
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

  const supabase = createClient({
    serviceRole: true,
  })

  await supabase
    .from('email_verification_codes')
    .insert<APIEmailVerificationRequest>({
      id,
      user_id: userId,
      code,
      email,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
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

  const supabase = createClient({
    serviceRole: true,
  })

  await supabase.from('email_verification_codes').delete().eq('user_id', userId)
}

export async function sendVerificationEmail(
  email: string,
  code: string,
): Promise<void> {
  'use server'

  await resend.emails.send({
    from: `GeoWorld <${process.env.RESEND_EMAIL_FROM}>`,
    to: email,
    subject: 'Verify your email address',
    react: VerifyEmailTemplate({
      validationCode: code,
    }),
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
