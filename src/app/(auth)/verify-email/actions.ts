'use server'

import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db/index.ts'
import { passwordResetTokensTable, usersTable } from '@/db/schema.ts'
import {
  createEmailVerificationRequest,
  deleteEmailVerificationRequestCookie,
  deleteUserEmailVerificationRequest,
  getUserEmailVerificationRequestFromRequest,
  sendVerificationEmail,
  // sendVerificationEmailBucket,
  setEmailVerificationRequestCookie,
} from '@/lib/email-verification.ts'
import { sendVerificationEmailBucket } from '@/lib/email-verification-utils.ts'
import { ExpiringTokenBucket } from '@/lib/rate-limit.ts'
import { globalPOSTRateLimit } from '@/lib/request.ts'
import { getCurrentSession } from '@/lib/session.ts'

const bucket = new ExpiringTokenBucket<string>(5, 60 * 30)

export async function verifyEmailAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  'use server'

  const rateLimited = await globalPOSTRateLimit()

  if (!rateLimited)
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

  await db
    .delete(passwordResetTokensTable)
    .where(eq(passwordResetTokensTable.userId, user.id))

  await db
    .update(usersTable)
    .set({
      email: verificationRequest.email,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    })
    .where(eq(usersTable.id, user.id))

  await deleteEmailVerificationRequestCookie()

  return redirect('/dashboard')
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
  await setEmailVerificationRequestCookie(verificationRequest)

  return {
    message: 'A new code was sent to your inbox.',
  }
}

interface ActionResult {
  message: string
}
