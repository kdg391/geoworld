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
      <h1 className={styles['form-title']}>{t('sign_in.sso')}</h1>
      <p className={styles['form-description']}>Sign in with your email</p>

      <Form />

      <p className={styles.msg}>
        <span>{t('do_not_have_account')}</span>
        <Link href="/sign-up" className={styles['ml-4']}>
          {t('sign_up')}
        </Link>
      </p>
    </div>
  )
}

export default SignIn
