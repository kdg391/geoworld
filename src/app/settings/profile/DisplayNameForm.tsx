'use client'

import dynamic from 'next/dynamic'
import { useFormState } from 'react-dom'

import { changeDisplayName } from '@/actions/profile.js'

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
  displayName: string
}

const DisplayNameForm = ({ displayName }: Props) => {
  'use client'

  const [state, action] = useFormState<FormState, FormData>(changeDisplayName, {
    errors: null,
  })

  return (
    <>
      <form action={action}>
        <label htmlFor="display-name">Display Name</label>
        <TextInput
          type="text"
          id="display-name"
          name="display-name"
          defaultValue={displayName ?? ''}
        />
        {state.errors?.newName && (
          <p style={{ color: 'var(--danger)' }}>{state.errors.newName}</p>
        )}

        <SubmitButton size="s" type="submit" formAction={action}>
          Change display name
        </SubmitButton>
      </form>
      {state.errors?.message && (
        <p style={{ color: 'red' }}>{state.errors.message}</p>
      )}
    </>
  )
}

export default DisplayNameForm
