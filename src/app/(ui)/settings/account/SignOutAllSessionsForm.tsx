'use client'

import { useActionState } from 'react'

import { signOutAllSessions } from '@/actions/auth.ts'
import Button from '@/components/common/Button/index.tsx'

interface FormState {
  errors: {
    message: string
  } | null
}

const SignOutAllSessionsForm = () => {
  'use client'

  const [state, action] = useActionState<FormState, FormData>(
    signOutAllSessions,
    {
      errors: null,
    },
  )

  return (
    <form action={action}>
      <Button type="submit" variant="danger">
        Sign Out of All Sessions
      </Button>
      {state.errors?.message && <p>{state.errors.message}</p>}
    </form>
  )
}

export default SignOutAllSessionsForm
