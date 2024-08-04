'use client'

import dynamic from 'next/dynamic'
import { useFormState } from 'react-dom'

import { signIn } from '../../../actions/auth.js'

import { useTranslation } from '../../../i18n/client.js'

import styles from '../page.module.css'

const SubmitButton = dynamic(() => import('../SubmitButton.js'))
const TextInput = dynamic(
  () => import('../../../components/common/TextInput/index.js'),
)

export interface FormState {
  errors: {
    email?: string[]
    password?: string[]
    message?: string
  } | null
}

const Form = () => {
  'use client'

  const { t } = useTranslation('auth')
  const [state, action] = useFormState<FormState, FormData>(signIn, {
    errors: null,
  })

  return (
    <form action={action} className={styles.form}>
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
        {state.errors?.email && <p>{state.errors.email}</p>}
      </div>
      <div>
        <label htmlFor="password" className={styles.label}>
          {t('password')}
        </label>
        <TextInput type="password" id="password" name="password" required />
        {state.errors?.password && <p>{state.errors.password}</p>}
      </div>
      {state.errors?.message && <p>{state.errors.message}</p>}
      <SubmitButton full formAction={action} className={styles.button}>
        {t('signIn')}
      </SubmitButton>
    </form>
  )
}

export default Form
