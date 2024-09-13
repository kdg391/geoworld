'use server'

import { createTranslation } from '@/i18n/server.js'

import styles from '../page.module.css'

import Form from './Form.js'

const ForgotPassword = async () => {
  'use server'

  const { t } = await createTranslation('auth')

  return (
    <div className={styles['form-container']}>
      <h1 className={styles['form-title']}>{t('forgot_password')}</h1>

      <Form />
    </div>
  )
}

export default ForgotPassword
