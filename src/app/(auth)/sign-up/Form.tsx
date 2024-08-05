'use client'

import dynamic from 'next/dynamic'
import { useFormState } from 'react-dom'

import { signUp } from '../../../actions/auth.js'

import { useTranslation } from '../../../i18n/client.js'

import styles from '../page.module.css'

const SubmitButton = dynamic(() => import('../SubmitButton.js'))
const TextInput = dynamic(
  () => import('../../../components/common/TextInput/index.js'),
)

export interface FormState {
  errors: {
    username?: string[]
    email?: string[]
    password?: string[]
    message?: string
  } | null
}

const Form = () => {
  'use client'

  const { t } = useTranslation('auth')
  const [state, action] = useFormState<FormState, FormData>(signUp, {
    errors: null,
  })

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
          pattern="([a-zA-Z])[a-zA-Z0-9_]*"
          required
        />
        {state.errors?.username && (
          <p className={styles['error-msg']}>{state.errors.username}</p>
        )}
      </div>
      <div>
        <label htmlFor="email" className={styles.label}>
          {t('email')}
        </label>
        <TextInput
          type="email"
          id="email"
          name="email"
          placeholder="me@example.com"
          required
        />
        {state.errors?.email && (
          <p className={styles['error-msg']}>{state.errors.email}</p>
        )}
      </div>
      <div>
        <label htmlFor="password" className={styles.label}>
          {t('password')}
        </label>
        <TextInput type="password" id="password" name="password" required />
        {state.errors?.password && (
          <p className={styles['error-msg']}>{state.errors.password}</p>
        )}
      </div>
      {state.errors?.message && (
        <p className={styles['error-msg']}>{state.errors.message}</p>
      )}
      <SubmitButton full formAction={action} className={styles['button']}>
        {t('signUp')}
      </SubmitButton>
    </form>
  )
}

export default Form
