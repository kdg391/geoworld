'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'

import { changeEmail } from '@/actions/auth.js'

import { useTranslation } from '@/i18n/client.js'

import styles from '../layout.module.css'

import SubmitButton from '@/components/common/SubmitButton/index.js'
import TextInput from '@/components/common/TextInput/index.js'

interface FormState {
  errors: {
    oldEmail?: string[]
    newEmail?: string[]
    message?: string
  } | null
}

interface Props {
  email: string | undefined
}

const EmailForm = ({ email }: Props) => {
  'use client'

  const [state, action] = useFormState<FormState, FormData>(changeEmail, {
    errors: null,
  })

  const [changes, setChanges] = useState(false)

  const { t } = useTranslation('auth')

  return (
    <>
      <form action={action}>
        <TextInput
          type="email"
          id="email"
          name="email"
          defaultValue={email ?? ''}
          className={styles.input}
          onChange={(event) => {
            setChanges(event.target.value.trim() !== (email ?? ''))
          }}
        />
        {state.errors?.newEmail &&
          state.errors.newEmail.map((msg) => (
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
          {t('change_email')}
        </SubmitButton>
      </form>
      {state.errors?.message && (
        <p className={styles['error-msg']}>{state.errors.message}</p>
      )}
    </>
  )
}

export default EmailForm
