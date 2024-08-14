'use server'

import dynamic from 'next/dynamic'

import { createTranslation } from '@/i18n/server.js'

import styles from '../page.module.css'

const Form = dynamic(() => import('./Form.js'))

const ForgotPassword = async () => {
  'use server'

  const { t } = await createTranslation('auth')

  return (
    <div className={styles['form-container']}>
      <h1 className={styles['form-title']}>{t('forgotPassword')}</h1>

      <Form />
    </div>
  )
}

export default ForgotPassword
