'use client'

import Link from 'next/link'
import { useFormState } from 'react-dom'

import { signInCredentials } from '@/actions/auth.js'

import { useTranslation } from '@/i18n/client.js'

import styles from '../page.module.css'

import SubmitButton from '@/components/common/SubmitButton/index.js'
import TextInput from '@/components/common/TextInput/index.js'

interface FormState {
  errors: {
    email?: string[]
    password?: string[]
    message?: string
  } | null
}

const Form = () => {
  'use client'

  const [state, action] = useFormState<FormState, FormData>(signInCredentials, {
    errors: null,
  })

  const { t } = useTranslation('auth')

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
      <div>
        <label htmlFor="password" className={styles.label}>
          {t('password')}
        </label>
        <TextInput
          type="password"
          id="password"
          name="password"
          required
          className={styles.input}
        />
        {state.errors?.password &&
          state.errors.password.map((msg) => (
            <p key={msg} className={styles['error-msg']}>
              {msg}
            </p>
          ))}
      </div>
      {state.errors?.message && (
        <p className={styles['error-msg']}>{state.errors.message}</p>
      )}
      <p className={styles.msg}>
        <Link href="/reset-password">{t('forgot_password')}</Link>
      </p>
      <SubmitButton full formAction={action} className={styles.button}>
        {t('sign_in')}
      </SubmitButton>
    </form>
  )
}

export default Form
