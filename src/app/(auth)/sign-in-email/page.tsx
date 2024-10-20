'use server'

import Link from 'next/link'

import { createTranslation } from '../../../i18n/server.js'

import styles from '../page.module.css'

import Form from './Form.js'

const SignIn = async () => {
  'use server'

  const { t } = await createTranslation('auth')

  return (
    <div className={styles['form-container']}>
      <h1 className={styles['form-title']}>{t('email_sign_in')}</h1>
      <p className={styles['form-description']}>{t('email_sign_in_desc')}</p>

      <Form />

      <p className={styles.msg}>
        <span>Is your account created with Discord or credentials?</span>
        <Link href="/sign-in" className={styles['ml-4']}>
          {t('sign_in')}
        </Link>
      </p>
    </div>
  )
}

export default SignIn
