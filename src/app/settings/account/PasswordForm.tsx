'use client'

import dynamic from 'next/dynamic'
import { useFormState } from 'react-dom'

import { changePassword } from '@/actions/auth.js'

const SubmitButton = dynamic(
  () => import('@/components/common/SubmitButton/index.js'),
)
const TextInput = dynamic(
  () => import('@/components/common/TextInput/index.js'),
)

export interface FormState {
  errors: {
    oldPassword?: string[]
    newPassword?: string[]
    confirmPassword?: string[]
    message?: string
  } | null
}

const PasswordForm = () => {
  'use client'

  const [state, action] = useFormState<FormState, FormData>(changePassword, {
    errors: null,
  })

  return (
    <>
      <form action={action}>
        <div>
          <label htmlFor="old-password">Current Password</label>
          <TextInput
            type="password"
            id="old-password"
            name="old-password"
            required
          />
        </div>
        {state.errors?.oldPassword && (
          <p style={{ color: 'red' }}>{state.errors.oldPassword}</p>
        )}

        <div>
          <label htmlFor="new-password">New Password</label>
          <TextInput
            type="password"
            id="new-password"
            name="new-password"
            required
          />
        </div>
        {state.errors?.newPassword && (
          <p style={{ color: 'red' }}>{state.errors.newPassword}</p>
        )}

        <div>
          <label htmlFor="confirm-password">Confirm Password</label>
          <TextInput
            type="password"
            id="confirm-password"
            name="confirm-password"
            required
          />
        </div>
        {state.errors?.confirmPassword && (
          <p style={{ color: 'red' }}>{state.errors.confirmPassword}</p>
        )}

        <SubmitButton size="s" type="submit" formAction={action}>
          Change password
        </SubmitButton>
      </form>
      {state.errors?.message && (
        <p style={{ color: 'red' }}>{state.errors.message}</p>
      )}
    </>
  )
}

export default PasswordForm
