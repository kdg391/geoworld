'use client'

import { useActionState } from 'react'

import { signIn } from '@/actions/auth.js'
import { useTranslation } from '@/i18n/client.js'

import SubmitButton from '@/components/common/SubmitButton/index.js'
import TextInput from '@/components/common/TextInput/index.js'

import styles from './page.module.css'

interface FormState {
  errors: {
    password?: string[]
    message?: string
  } | null
}

const Form = () => {
  'use client'

  const [state, action] = useActionState<FormState, FormData>(signIn, {
    errors: null,
  })

  const { t } = useTranslation('auth')

  return (
    <form action={action} className={styles.form}>
      <div>
        <label htmlFor="password" className={styles.label}>
          {t('password')}
        </label>
        <TextInput
          fullWidth
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
        <p className={styles['error-msg']}>{t(state.errors.message)}</p>
      )}
      <SubmitButton full formAction={action} className={styles.button}>
        {t('sign_in')}
      </SubmitButton>
    </form>
  )
}

export default Form
