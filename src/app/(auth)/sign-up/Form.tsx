'use client'

import dynamic from 'next/dynamic'
import { useFormState } from 'react-dom'

import { signUp } from '../../../actions/auth.js'

import { useTranslation } from '../../../i18n/client.js'

import styles from '../page.module.css'

const SubmitButton = dynamic(() => import('../SubmitButton.js'))

export interface FormState {
  errors: {
    email?: string[]
    password?: string[]
    confirmPassword?: string[]
    message?: string
  } | null
}

const Form = () => {
  'use client'
  const { t } = useTranslation('translation')
  const [state, action] = useFormState<FormState, FormData>(signUp, {
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
      <div>
        <label htmlFor="password" className={styles.label}>
          {t('auth.password')}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className={styles.input}
        />
        {state.errors?.password && <p>{state.errors.password}</p>}
      </div>
      <div>
        <label htmlFor="confirm-password" className={styles.label}>
          {t('auth.confirmPassword')}
        </label>
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          required
          className={styles.input}
        />
        {state.errors?.confirmPassword && <p>{state.errors.confirmPassword}</p>}
      </div>
      {state.errors?.message && <p>{state.errors.message}</p>}
      <SubmitButton
        formAction={action}
        pendingText="Signing Up..."
        className={styles['button']}
      >
        {t('auth.signUp')}
      </SubmitButton>
    </form>
  )
}

export default Form
