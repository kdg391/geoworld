'use server'

import Link from 'next/link'

import { createTranslation } from '@/i18n/server.js'

import Form from './form.js'

import styles from '../../page.module.css'

const SignIn = async () => {
  'use server'

  const { t } = await createTranslation('auth')

  return (
    <div className={styles['form-container']}>
      <h1 className={styles['form-title']}>{t('continue_with_email')}</h1>
      <p className={styles['form-description']}>{t('email_sign_in.desc')}</p>

      <Form />

      <p className={styles.msg}>
        <span>{t('already_account')}</span>
        <Link href="/sign-in" className="ml-1">
          {t('sign_in')}
        </Link>
      </p>
    </div>
  )
}

export default SignIn
