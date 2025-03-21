'use client'

import { useActionState, useState } from 'react'

import { changePassword } from '@/actions/account.js'

import { useTranslation } from '@/i18n/client.js'

import SubmitButton from '@/components/common/SubmitButton/index.js'
import TextInput from '@/components/common/TextInput/index.js'

import styles from '../layout.module.css'

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

  const [state, action] = useActionState<FormState, FormData>(changePassword, {
    errors: null,
  })

  const [oldPwChanges, setOldPwChanges] = useState(false)
  const [newPwChanges, setNewPwChanges] = useState(false)
  const [confirmPwChanges, setConfirmPwChanges] = useState(false)

  const { t } = useTranslation(['account', 'settings'])

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
            className={styles.input}
            onChange={(event) => {
              setOldPwChanges(event.target.value !== '')
            }}
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
            onChange={(event) => {
              setNewPwChanges(event.target.value !== '')
            }}
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
            onChange={(event) => {
              setConfirmPwChanges(event.target.value !== '')
            }}
          />
        </div>
        {state.errors?.confirmPassword &&
          state.errors.confirmPassword.map((msg) => (
            <p key={msg} className={styles['error-msg']}>
              {msg}
            </p>
          ))}

        <SubmitButton
          size="s"
          type="submit"
          formAction={action}
          disabled={!oldPwChanges || !newPwChanges || !confirmPwChanges}
        >
          {t('change_password', {
            ns: 'settings',
          })}
        </SubmitButton>
      </form>
      {state.errors?.message && (
        <p className={styles['error-msg']}>{state.errors.message}</p>
      )}
    </>
  )
}

export default PasswordForm
