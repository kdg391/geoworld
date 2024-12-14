'use client'

import { useActionState } from 'react'

import { signInWithEmail } from '@/actions/auth.js'

import { useTranslation } from '@/i18n/client.js'

import SubmitButton from '@/components/common/SubmitButton/index.js'
import TextInput from '@/components/common/TextInput/index.js'

import styles from '../../page.module.css'

interface FormState {
  errors: {
    email?: string[]
    message?: string
  } | null
}

const Form = () => {
  'use client'

  const [state, action] = useActionState<FormState, FormData>(signInWithEmail, {
    errors: null,
  })

  const { t } = useTranslation(['auth', 'account'])

  return (
    <form action={action} className={styles.form}>
      <div>
        <label htmlFor="email" className={styles.label}>
          {t('email', {
            ns: 'account',
          })}
        </label>
        <TextInput
          fullWidth
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
        Continue with Email
      </SubmitButton>
    </form>
  )
}

export default Form
