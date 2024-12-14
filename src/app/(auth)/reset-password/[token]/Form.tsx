'use client'

import { useActionState } from 'react'

import { resetPassword } from '@/actions/password.js'

import { useTranslation } from '@/i18n/client.js'

import SubmitButton from '@/components/common/SubmitButton/index.js'
import TextInput from '@/components/common/TextInput/index.js'

import styles from '../../page.module.css'

interface FormState {
  errors: {
    password?: string[]
    confirmPassword?: string[]
    message?: string
  } | null
}

interface Props {
  token: string
}

const Form = ({ token }: Props) => {
  'use client'

  const [state, action] = useActionState<FormState, FormData>(resetPassword, {
    errors: null,
  })

  const { t } = useTranslation(['auth', 'account'])

  return (
    <form action={action} className={styles.form}>
      <input type="hidden" value={token} name="token" hidden />
      <div>
        <label htmlFor="password" className={styles.label}>
          {t('new_password', {
            ns: 'account',
          })}
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
      <div>
        <label htmlFor="confirm-password" className={styles.label}>
          {t('new_confirm_password', {
            ns: 'account',
          })}
        </label>
        <TextInput
          fullWidth
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
