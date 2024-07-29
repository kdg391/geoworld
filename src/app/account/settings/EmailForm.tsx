'use client'

import dynamic from 'next/dynamic'
import { useFormState } from 'react-dom'

import { changeEmail } from './actions.js'
import { useTranslation } from '../../../i18n/client.js'

const SubmitButton = dynamic(() => import('../../(auth)/SubmitButton.js'))

export interface FormState {
  data: string | null
  error: string | null
}

const EmailForm = ({ email }: { email: string | undefined }) => {
  'use client'
  const [state, action] = useFormState<FormState, FormData>(changeEmail, {
    data: null,
    error: null,
  })

  const { t } = useTranslation('translation')

  return (
    <>
      <form action={action}>
        <label htmlFor="email">{t('auth.email')}</label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue={email ?? ''}
        />

        <SubmitButton type="submit" formAction={action}>
          Change Email
        </SubmitButton>
      </form>
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
    </>
  )
}

export default EmailForm
