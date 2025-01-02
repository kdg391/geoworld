'use client'

import { useActionState } from 'react'

import { signOutSession } from '@/actions/auth.js'

import Button from '@/components/common/Button/index.js'

interface Props {
  sessionId: string
}

interface FormState {
  errors: {
    message: string
  } | null
}

const SignOutSessionForm = ({ sessionId }: Props) => {
  'use client'

  const [state, action] = useActionState<FormState, FormData>(signOutSession, {
    errors: null,
  })

  return (
    <form action={action}>
      <input type="hidden" name="session-id" value={sessionId} />
      <Button type="submit" variant="danger">
        Sign Out
      </Button>
      {state.errors?.message && <p>{state.errors.message}</p>}
    </form>
  )
}

export default SignOutSessionForm
