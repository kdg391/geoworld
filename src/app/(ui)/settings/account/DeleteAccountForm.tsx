'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'

import { deleteAccount } from '@/actions/auth.js'

import { useTranslation } from '@/i18n/client.js'

import styles from '../layout.module.css'

import SubmitButton from '@/components/common/SubmitButton/index.js'
import TextInput from '@/components/common/TextInput/index.js'

interface FormState {
  errors: {
    password?: string[]
    confirmMessage?: string[]
    message?: string
  } | null
}

const DeleteAccountForm = () => {
  'use client'

  const [state, action] = useFormState<FormState, FormData>(deleteAccount, {
    errors: null,
  })

  const [pwChanges, setPwChanges] = useState(false)
  const [confirmChanges, setConfirmChanges] = useState(false)

  const { t } = useTranslation('auth')

  return (
    <>
      <h3>Delete Accoount</h3>
      <p>We will delete all of your data. It cannot be reversed.</p>
      <form action={action}>
        <div>
          <label htmlFor="password">Enter your password to continue:</label>
          <TextInput
            type="password"
            id="password"
            name="password"
            className={styles.input}
            onChange={(event) => {
              setPwChanges(event.target.value !== '')
            }}
          />
          {state.errors?.password &&
            state.errors.password.map((msg) => (
              <p key={msg} className={styles['error-msg']}>
                {msg}
              </p>
            ))}
        </div>
        <div>
          <label htmlFor="password">
            Type <strong>DELETE</strong> below:
          </label>
          <TextInput
            type="text"
            id="message"
            name="message"
            className={styles.input}
            onChange={(event) => {
              setConfirmChanges(event.target.value === 'DELETE')
            }}
          />
          {state.errors?.confirmMessage &&
            state.errors.confirmMessage.map((msg) => (
              <p key={msg} className={styles['error-msg']}>
                {msg}
              </p>
            ))}
        </div>

        <SubmitButton
          variant="danger"
          size="s"
          type="submit"
          formAction={action}
          isLoading={false}
          disabled={!pwChanges || !confirmChanges}
        >
          {t('delete_account')}
        </SubmitButton>
      </form>
      {state.errors?.message && (
        <p className={styles['error-msg']}>{state.errors.message}</p>
      )}
    </>
  )
}

export default DeleteAccountForm
