'use client'

import { useActionState, useState } from 'react'

import { deleteAccount } from '@/actions/account.js'

import { useTranslation } from '@/i18n/client.js'

import SubmitButton from '@/components/common/SubmitButton/index.js'
import TextInput from '@/components/common/TextInput/index.js'

import styles from '../layout.module.css'

interface FormState {
  errors: {
    password?: string[]
    confirmMessage?: string[]
    message?: string
  } | null
}

const DeleteAccountForm = () => {
  'use client'

  const [state, action] = useActionState<FormState, FormData>(deleteAccount, {
    errors: null,
  })

  const [pwChanges, setPwChanges] = useState(false)
  const [confirmChanges, setConfirmChanges] = useState(false)

  const { t } = useTranslation(['account', 'settings'])

  return (
    <>
      <h3>
        {t('delete_account', {
          ns: 'settings',
        })}
      </h3>
      <p>We will delete all of your data. It cannot be reversed.</p>
      <form action={action}>
        <div>
          <label htmlFor="password" className="mb-1">
            Enter your password to continue:
          </label>
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
          <label htmlFor="password" className="mb-1">
            Type <strong>DELETE</strong> below:
          </label>
          <TextInput
            type="text"
            id="confirm-message"
            name="confirm-message"
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
          {t('delete_account', {
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

export default DeleteAccountForm
