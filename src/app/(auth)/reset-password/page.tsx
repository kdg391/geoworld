'use server'

import { createTranslation } from '@/i18n/server.js'

import styles from '../page.module.css'

import Form from './Form.js'

const ResetPassword = async () => {
  'use server'

  const { t } = await createTranslation('auth')

  return (
    <div className={styles['form-container']}>
      <h1 className={styles['form-title']}>{t('reset_password')}</h1>
      <p className={styles['form-description']}>
        {"Enter your email and we'll send you a link to reset your password."}
      </p>

      <Form />
    </div>
  )
}

export default ResetPassword
