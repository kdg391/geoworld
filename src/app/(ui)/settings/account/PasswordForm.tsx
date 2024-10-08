'use client'

import dynamic from 'next/dynamic'
import { useFormState } from 'react-dom'

import { changePassword } from '@/actions/auth.js'

import { useTranslation } from '@/i18n/client.js'

import styles from '../layout.module.css'

const SubmitButton = dynamic(
  () => import('@/components/common/SubmitButton/index.js'),
)
const TextInput = dynamic(
  () => import('@/components/common/TextInput/index.js'),
)

interface FormState {
  errors: {
    oldPassword?: string[]
    newPassword?: string[]
    confirmPassword?: string[]
    message?: string
  } | null
}

const PasswordForm = () => {
  'use client'

  const [state, action] = useFormState<FormState, FormData>(changePassword, {
    errors: null,
  })

  const { t } = useTranslation('auth')

  return (
    <>
      <form action={action}>
        <div>
          <label htmlFor="old-password">{t('current_password')}</label>
          <TextInput
            type="password"
            id="old-password"
            name="old-password"
            required
          />
        </div>
        {state.errors?.oldPassword &&
          state.errors.oldPassword.map((msg) => (
            <p key={msg} className={styles['error-msg']}>
              {msg}
            </p>
          ))}

        <div>
          <label htmlFor="new-password">{t('new_password')}</label>
          <TextInput
            type="password"
            id="new-password"
            name="new-password"
            required
            className={styles.input}
          />
        </div>
        {state.errors?.newPassword &&
          state.errors.newPassword.map((msg) => (
            <p key={msg} className={styles['error-msg']}>
              {msg}
            </p>
          ))}

        <div>
          <label htmlFor="confirm-password">{t('confirm_password')}</label>
          <TextInput
            type="password"
            id="confirm-password"
            name="confirm-password"
            required
            className={styles.input}
          />
        </div>
        {state.errors?.confirmPassword &&
          state.errors.confirmPassword.map((msg) => (
            <p key={msg} className={styles['error-msg']}>
              {msg}
            </p>
          ))}

        <SubmitButton size="s" type="submit" formAction={action}>
          Change password
        </SubmitButton>
      </form>
      {state.errors?.message && (
        <p className={styles['error-msg']}>{state.errors.message}</p>
      )}
    </>
  )
}

export default PasswordForm
