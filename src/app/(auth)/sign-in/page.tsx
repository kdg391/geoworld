'use server'

import dynamic from 'next/dynamic'
import Link from 'next/link'

import { createTranslation } from '../../../i18n/server.js'

import styles from '../page.module.css'

const Form = dynamic(() => import('./Form.js'))

const SignIn = async () => {
  'use server'

  const { t } = await createTranslation('auth')

  return (
    <div className={styles['form-container']}>
      <h1 className={styles['form-title']}>{t('signIn')}</h1>

      <Form />

      <p className={styles.msg}>
        <Link href="/forgot-password">{t('forgotPassword')}</Link>
      </p>
      <p className={styles.msg}>
        <span>{t('doNotHaveAccount')}</span>
        <Link href="/sign-up" className={styles['ml-4']}>
          {t('signUp')}
        </Link>
      </p>
    </div>
  )
}

export default SignIn
