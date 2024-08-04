'use client'

import dynamic from 'next/dynamic'
import { useFormState } from 'react-dom'

import { updatePassword } from '../../../actions/auth.js'

import { useTranslation } from '../../../i18n/client.js'

import styles from '../page.module.css'

const SubmitButton = dynamic(() => import('../SubmitButton.js'))
const TextInput = dynamic(
  () => import('../../../components/common/TextInput/index.js'),
)

export interface FormState {
  errors: {
    password?: string[]
    confirmPassword?: string[]
    message?: string
  } | null
}

const Form = () => {
  'use client'

  const { t } = useTranslation('auth')

  const [state, action] = useFormState<FormState, FormData>(updatePassword, {
    errors: null,
  })

  return (
    <form action={action} className={styles.form}>
      <div>
        <label htmlFor="password" className={styles.label}>
          {t('newPassword')}
        </label>
        <TextInput type="password" id="password" name="password" required />
        {state.errors?.password && <p>{state.errors.password}</p>}
      </div>
      <div>
        <label htmlFor="confirm-password" className={styles.label}>
          {t('confirmPassword')}
        </label>
        <TextInput
          type="password"
          id="confirm-password"
          name="confirm-password"
          required
        />
        {state.errors?.confirmPassword && <p>{state.errors.confirmPassword}</p>}
      </div>
      {state.errors?.message && <p>{state.errors.message}</p>}
      <SubmitButton full formAction={action} className={styles.button}>
        {t('updatePassword')}
      </SubmitButton>
    </form>
  )
}

export default Form
