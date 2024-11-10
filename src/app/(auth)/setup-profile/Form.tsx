'use client'

import { useActionState } from 'react'

import { setupProfile } from '@/actions/profile.js'

import { useTranslation } from '@/i18n/client.js'

import styles from '../page.module.css'

import SubmitButton from '@/components/common/SubmitButton/index.js'
import TextInput from '@/components/common/TextInput/index.js'

interface FormState {
  errors: {
    username?: string[]
    displayName?: string[]
    message?: string
  } | null
}

const Form = () => {
  'use client'

  const [state, action] = useActionState<FormState, FormData>(setupProfile, {
    errors: null,
  })

  const { t } = useTranslation('profile')

  return (
    <form action={action} className={styles.form}>
      <div>
        <label htmlFor="username" className={styles.label}>
          {t('username')}
        </label>
        <TextInput
          type="text"
          id="username"
          name="username"
          minLength={1}
          maxLength={20}
          pattern="[a-z][a-z0-9_]*"
          required
          className={styles.input}
          onChange={(event) => {
            event.target.value = event.target.value.toLowerCase()
          }}
        />
        {state.errors?.username &&
          state.errors.username.map((msg) => (
            <p key={msg} className={styles['error-msg']}>
              {msg}
            </p>
          ))}
      </div>
      <div>
        <label htmlFor="display-name" className={styles.label}>
          {t('display_name')}
        </label>
        <TextInput
          type="text"
          id="display-name"
          name="display-name"
          minLength={1}
          maxLength={20}
          required
          className={styles.input}
        />
        {state.errors?.displayName &&
          state.errors.displayName.map((msg) => (
            <p key={msg} className={styles['error-msg']}>
              {msg}
            </p>
          ))}
      </div>
      {state.errors?.message && (
        <p className={styles['error-msg']}>{state.errors.message}</p>
      )}
      <SubmitButton full formAction={action} className={styles.button}>
        {t('save_profile')}
      </SubmitButton>
    </form>
  )
}

export default Form
