'use client'

import { useActionState } from 'react'

import {
  resendEmailVerificationCodeAction,
  verifyEmailAction,
} from './actions.js'

import Button from '@/components/common/Button/index.js'

const emailVerificationInitialState = {
  message: '',
}

export function EmailVerificationForm() {
  const [state, action] = useActionState(
    verifyEmailAction,
    emailVerificationInitialState,
  )

  return (
    <form action={action}>
      <div>
        <label htmlFor="form-verify.code">Code</label>
        <input id="form-verify.code" name="code" required />
      </div>
      <div>
        <Button type="submit" variant="primary">
          Verify
        </Button>
      </div>
      <p>{state.message}</p>
    </form>
  )
}

const resendEmailInitialState = {
  message: '',
}

export function ResendEmailVerificationCodeForm() {
  const [state, action] = useActionState(
    resendEmailVerificationCodeAction,
    resendEmailInitialState,
  )

  return (
    <form action={action}>
      <Button type="submit" variant="primary">
        Resend code
      </Button>
      <p>{state.message}</p>
    </form>
  )
}
