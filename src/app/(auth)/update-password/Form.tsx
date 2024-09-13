'use client'

import { useFormState } from 'react-dom'

import { updatePassword } from '@/actions/auth.js'

import { useTranslation } from '@/i18n/client.js'

import styles from '../page.module.css'

import SubmitButton from '@/components/common/SubmitButton/index.js'
import TextInput from '@/components/common/TextInput/index.js'

interface FormState {
  errors: {
    password?: string[]
    confirmPassword?: string[]
    message?: string
  } | null
}

const Form = ({ code }: { code: string }) => {
  'use client'

  const { t } = useTranslation('auth')

  const [state, action] = useFormState<FormState, FormData>(updatePassword, {
    errors: null,
  })

  return (
    <form action={action} className={styles.form}>
      <input type="hidden" value={code} name="code" hidden />
      <div>
        <label htmlFor="password" className={styles.label}>
          {t('new_password')}
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
      <div>
        <label htmlFor="confirm-password" className={styles.label}>
          {t('confirm_password')}
        </label>
        <TextInput
          type="password"
          id="confirm-password"
          name="confirm-password"
          required
          className={styles.input}
        />
        {state.errors?.confirmPassword &&
          state.errors.confirmPassword.map((msg) => (
            <p key={msg} className={styles['error-msg']}>
              {msg}
            </p>
          ))}
      </div>
      {state.errors?.message && (
        <p className={styles['error-msg']}>{state.errors.message}</p>
      )}
      <SubmitButton full formAction={action} className={styles.button}>
        {t('update_password')}
      </SubmitButton>
    </form>
  )
}

export default Form
