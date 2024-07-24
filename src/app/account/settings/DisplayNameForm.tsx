'use client'

import dynamic from 'next/dynamic'
import { useFormState } from 'react-dom'

import { changeDisplayName } from './actions.js'

const SubmitButton = dynamic(() => import('../../(auth)/SubmitButton.js'))

export interface FormState {
  data: string | null
  error: string | null
}

const DisplayNameForm = ({ displayName }: { displayName: string }) => {
  'use client'
  const [state, action] = useFormState<FormState, FormData>(changeDisplayName, {
    data: null,
    error: null,
  })

  return (
    <>
      <form action={action}>
        <label htmlFor="display-name">Display Name</label>
        <input
          type="text"
          id="display-name"
          name="display-name"
          defaultValue={displayName ?? ''}
        />

        <SubmitButton
          type="submit"
          formAction={action}
          pendingText="Changing Display Name..."
        >
          Change Display Name
        </SubmitButton>
      </form>
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
    </>
  )
}

export default DisplayNameForm
