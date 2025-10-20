'use server'

import { createTranslation } from '@/i18n/server.ts'

import styles from '../page.module.css'

import Form from './form.tsx'

const ForgotPassword = async () => {
  'use server'

  const { t } = await createTranslation('auth')

  return (
    <div className={styles['form-container']}>
      <h1 className={styles['form-title']}>{t('forgot_password')}</h1>
      <p className={styles['form-description']}>{t('forgot_password.desc')}</p>

      <Form />
    </div>
  )
}

export default ForgotPassword
