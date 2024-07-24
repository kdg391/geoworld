'use client'

import dynamic from 'next/dynamic'
import { useFormState } from 'react-dom'

import { resetPassword } from '../../../actions/auth.js'

import { useTranslation } from '../../../i18n/client.js'

import styles from '../page.module.css'

const SubmitButton = dynamic(() => import('../SubmitButton.js'))

export interface FormState {
  errors: {
    email?: string[]
    message?: string
  } | null
}

const Form = () => {
  'use client'
  const { t } = useTranslation('translation')

  const [state, action] = useFormState<FormState, FormData>(resetPassword, {
    errors: null,
  })

  return (
    <form action={action} className={styles.form}>
      <div>
        <label htmlFor="email" className={styles.label}>
          {t('auth.email')}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="me@example.com"
          required
          className={styles.input}
        />
        {state.errors?.email && <p>{state.errors.email}</p>}
      </div>
      {state.errors?.message && <p>{state.errors.message}</p>}
      <SubmitButton formAction={action} className={styles.button}>
        {t('auth.resetPassword')}
      </SubmitButton>
    </form>
  )
}

export default Form
