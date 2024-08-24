'use client'

import dynamic from 'next/dynamic'
import { useFormState } from 'react-dom'

import { resetPassword } from '@/actions/auth.js'

import { useTranslation } from '@/i18n/client.js'

import styles from '../page.module.css'

const SubmitButton = dynamic(
  () => import('@/components/common/SubmitButton/index.js'),
)
const TextInput = dynamic(
  () => import('@/components/common/TextInput/index.js'),
)

export interface FormState {
  errors: {
    email?: string[]
    message?: string
  } | null
}

const Form = () => {
  'use client'

  const { t } = useTranslation('auth')

  const [state, action] = useFormState<FormState, FormData>(resetPassword, {
    errors: null,
  })

  return (
    <form action={action} className={styles.form}>
      <div>
        <label htmlFor="email" className={styles.label}>
          {t('email')}
        </label>
        <TextInput
          type="email"
          id="email"
          name="email"
          placeholder="me@example.com"
          required
          className={styles.input}
        />
        {state.errors?.email &&
          state.errors.email.map((msg) => (
            <p key={msg} className={styles['error-msg']}>
              {msg}
            </p>
          ))}
      </div>
      {state.errors?.message && (
        <p className={styles['error-msg']}>{state.errors.message}</p>
      )}
      <SubmitButton full formAction={action} className={styles.button}>
        {t('resetPassword')}
      </SubmitButton>
    </form>
  )
}

export default Form
