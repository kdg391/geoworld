'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'

import { changeDisplayName } from '@/actions/profile.js'

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
  displayName: string
}

const DisplayNameForm = ({ displayName }: Props) => {
  'use client'

  const [state, action] = useFormState<FormState, FormData>(changeDisplayName, {
    errors: null,
  })

  const { t } = useTranslation('auth')

  const [changes, setChanges] = useState(false)

  return (
    <>
      <form action={action}>
        <TextInput
          type="text"
          id="display-name"
          name="display-name"
          minLength={1}
          maxLength={20}
          required
          defaultValue={displayName}
          className={styles.input}
          onChange={(event) => {
            setChanges(event.target.value.trim() !== displayName)
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
          {t('change_display_name')}
        </SubmitButton>
      </form>
      {state.errors?.message && (
        <p className={styles['error-msg']}>{state.errors.message}</p>
      )}
    </>
  )
}

export default DisplayNameForm
