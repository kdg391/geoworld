'use client'

import { useActionState, useState } from 'react'

import { changeUsername } from '@/actions/profile.js'

import { useTranslation } from '@/i18n/client.js'

import styles from '../layout.module.css'

import SubmitButton from '@/components/common/SubmitButton/index.js'
import TextInput from '@/components/common/TextInput/index.js'

interface FormState {
  errors: {
    oldName?: string[]
    newName?: string[]
    message?: string
  } | null
}

interface Props {
  username: string
}

const UsernameForm = ({ username }: Props) => {
  'use client'

  const [state, action] = useActionState<FormState, FormData>(changeUsername, {
    errors: null,
  })

  const [changes, setChanges] = useState(false)

  const { t } = useTranslation(['profile', 'settings'])

  return (
    <>
      <form action={action}>
        <TextInput
          type="text"
          id="username"
          name="username"
          minLength={1}
          maxLength={20}
          pattern="[a-z][a-z0-9_]*"
          required
          defaultValue={username}
          className={styles.input}
          onChange={(event) => {
            event.target.value = event.target.value.toLowerCase()

            setChanges(event.target.value.trim() !== username)
          }}
        />
        {state.errors?.newName &&
          state.errors.newName.map((msg) => (
            <p key={msg} className={styles['error-msg']}>
              {msg}
            </p>
          ))}

        <SubmitButton
          size="s"
          type="submit"
          formAction={action}
          isLoading={false}
          disabled={!changes}
        >
          {t('change_username', {
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

export default UsernameForm
