'use client'

import dynamic from 'next/dynamic'
import { useFormState } from 'react-dom'

import { changeEmail } from './actions.js'

import { useTranslation } from '../../../i18n/client.js'

const SubmitButton = dynamic(() => import('../../(auth)/SubmitButton.js'))
const TextInput = dynamic(
  () => import('../../../components/common/TextInput/index.js'),
)

export interface FormState {
  data: string | null
  errors: {
    oldEmail?: string[]
    newEmail?: string[]
    message?: string
  } | null
}

const EmailForm = ({ email }: { email: string | undefined }) => {
  'use client'

  const [state, action] = useFormState<FormState, FormData>(changeEmail, {
    data: null,
    errors: null,
  })

  const { t } = useTranslation('auth')

  return (
    <>
      <form action={action}>
        <label htmlFor="email">{t('email')}</label>
        <TextInput
          type="email"
          id="email"
          name="email"
          defaultValue={email ?? ''}
        />
        {state.errors?.newEmail && (
          <p style={{ color: 'red' }}>{state.errors?.newEmail}</p>
        )}

        <SubmitButton size="s" type="submit" formAction={action}>
          Change email
        </SubmitButton>
      </form>
      {state.errors?.message && (
        <p style={{ color: 'red' }}>{state.errors?.message}</p>
      )}
    </>
  )
}

export default EmailForm
