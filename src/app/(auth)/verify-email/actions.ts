'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import {
  createEmailVerificationRequest,
  // deleteEmailVerificationRequestCookie,
  deleteUserEmailVerificationRequest,
  getUserEmailVerificationRequestFromRequest,
  sendVerificationEmail,
  // sendVerificationEmailBucket,
  // setEmailVerificationRequestCookie,
} from '@/email-verification.js'
import { sendVerificationEmailBucket } from '@/email-verification-utils.js'
import { ExpiringTokenBucket } from '@/rate-limit.js'
import { globalPOSTRateLimit } from '@/request.js'
import { getCurrentSession } from '@/session.js'

import { createClient } from '@/utils/supabase/server.js'

const bucket = new ExpiringTokenBucket<string>(5, 60 * 30)

export async function verifyEmailAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  'use server'

  if (!(await globalPOSTRateLimit()))
    return {
      message: 'Too many requests',
    }

  const { session, user } = await getCurrentSession()

  if (session === null)
    return {
      message: 'Not authenticated',
    }

  if (!bucket.check(user.id, 1))
    return {
      message: 'Too many requests',
    }

  let verificationRequest = await getUserEmailVerificationRequestFromRequest()

  if (verificationRequest === null)
    return {
      message: 'Not authenticated',
    }

  const code = formData.get('code')

  if (typeof code !== 'string')
    return {
      message: 'Invalid or missing fields',
    }

  if (code === '')
    return {
      message: 'Enter your code',
    }

  if (!bucket.consume(user.id, 1))
    return {
      message: 'Too many requests',
    }

  if (Date.now() >= verificationRequest.expiresAt.getTime()) {
    verificationRequest = await createEmailVerificationRequest(
      verificationRequest.userId,
      verificationRequest.email,
    )

    await sendVerificationEmail(
      verificationRequest.email,
      verificationRequest.code,
    )

    return {
      message:
        'The verification code was expired. We sent another code to your inbox.',
    }
  }

  if (verificationRequest.code !== code)
    return {
      message: 'Incorrect code.',
    }

  await deleteUserEmailVerificationRequest(user.id)

  const supabase = createClient({
    serviceRole: true,
  })

  await supabase.from('password_reset_tokens').delete().eq('user_id', user.id)

  await supabase
    .from('users')
    .update({
      email: verificationRequest.email,
      email_verified: true,
      email_verified_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  // await deleteEmailVerificationRequestCookie()
  const cookieStore = await cookies()

  cookieStore.set('email_verification', '', {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  })

  return redirect('/')
}

export async function resendEmailVerificationCodeAction(): Promise<ActionResult> {
  'use server'

  const { session, user } = await getCurrentSession()

  if (session === null)
    return {
      message: 'Not authenticated',
    }

  if (!sendVerificationEmailBucket.check(user.id, 1))
    return {
      message: 'Too many requests',
    }

  let verificationRequest = await getUserEmailVerificationRequestFromRequest()

  if (verificationRequest === null) {
    if (user.emailVerified)
      return {
        message: 'Forbidden',
      }

    if (!sendVerificationEmailBucket.consume(user.id, 1))
      return {
        message: 'Too many requests',
      }

    verificationRequest = await createEmailVerificationRequest(
      user.id,
      user.email,
    )
  } else {
    if (!sendVerificationEmailBucket.consume(user.id, 1))
      return {
        message: 'Too many requests',
      }

    verificationRequest = await createEmailVerificationRequest(
      user.id,
      verificationRequest.email,
    )
  }

  await sendVerificationEmail(
    verificationRequest.email,
    verificationRequest.code,
  )

  // await setEmailVerificationRequestCookie(verificationRequest)
  const cookieStore = await cookies()

  cookieStore.set('email_verification', verificationRequest.id, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: verificationRequest.expiresAt,
  })

  return {
    message: 'A new code was sent to your inbox.',
  }
}

interface ActionResult {
  message: string
}
