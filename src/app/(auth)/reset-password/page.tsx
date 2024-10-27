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
      <p className={styles['form-description']}>{t('reset_password_desc')}</p>

      <Form />
    </div>
  )
}

export default ResetPassword
