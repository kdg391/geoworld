'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useFormState } from 'react-dom'

import { changeUsername } from '@/actions/profile.js'

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

  const [state, action] = useFormState<FormState, FormData>(changeUsername, {
    errors: null,
  })

  const [changes, setChanges] = useState(false)

  const { t } = useTranslation('auth')

  return (
    <>
      <form action={action}>
        <label htmlFor="username">{t('username')}</label>
        <TextInput
          type="text"
          id="username"
          name="username"
          minLength={1}
          maxLength={20}
          pattern="[a-z][a-z0-9_]*"
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
          Change username
        </SubmitButton>
      </form>
      {state.errors?.message && (
        <p className={styles['error-msg']}>{state.errors.message}</p>
      )}
    </>
  )
}

export default UsernameForm
