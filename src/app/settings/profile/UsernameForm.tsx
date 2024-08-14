'use client'

import dynamic from 'next/dynamic'
import { useFormState } from 'react-dom'

import { changeUsername } from '@/actions/profile.js'

const SubmitButton = dynamic(
  () => import('@/components/common/SubmitButton/index.js'),
)
const TextInput = dynamic(
  () => import('@/components/common/TextInput/index.js'),
)

export interface FormState {
  errors: {
    oldName?: string[]
    newName?: string[]
    message?: string
  } | null
}

interface Props {
  username: string
}

const UsernameForm = ({ username }: Props) => {
  'use client'

  const [state, action] = useFormState<FormState, FormData>(changeUsername, {
    errors: null,
  })

  return (
    <>
      <form action={action}>
        <label htmlFor="username">Username</label>
        <TextInput
          type="text"
          id="username"
          name="username"
          pattern="[a-z][a-z0-9_]*"
          defaultValue={username ?? ''}
        />
        {state.errors?.newName && (
          <p style={{ color: 'red' }}>{state.errors.newName}</p>
        )}

        <SubmitButton size="s" type="submit" formAction={action}>
          Change username
        </SubmitButton>
      </form>
      {state.errors?.message && (
        <p style={{ color: 'red' }}>{state.errors.message}</p>
      )}
    </>
  )
}

export default UsernameForm
