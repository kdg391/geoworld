'use server'

// import Link from 'next/link'
import { redirect } from 'next/navigation'

import {
  EmailVerificationForm,
  ResendEmailVerificationCodeForm,
} from './form.js'

import { getUserEmailVerificationRequestFromRequest } from '@/email-verification.js'
import { globalGETRateLimit } from '@/request.js'
import { getCurrentSession } from '@/session.js'

export default async function Page() {
  'use server'

  if (!(await globalGETRateLimit())) return 'Too many requests'

  const { user } = await getCurrentSession()

  if (user === null) return redirect('/sign-in')

  // TODO: Ideally we'd sent a new verification email automatically if the previous one is expired,
  // but we can't set cookies inside server components.
  const verificationRequest = await getUserEmailVerificationRequestFromRequest()

  if (verificationRequest === null && user.emailVerified) return redirect('/')

  return (
    <>
      <h1>Verify your email address</h1>
      <p>
        We sent an 8-letter code to {verificationRequest?.email ?? user.email}.
      </p>
      <div>
        <EmailVerificationForm />
      </div>
      <div>
        <ResendEmailVerificationCodeForm />
      </div>
      {/* <Link href="/settings">Change your email</Link> */}
    </>
  )
}
