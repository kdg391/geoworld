'use server'

import dynamic from 'next/dynamic'
import Link from 'next/link'

import { createTranslation } from '@/i18n/server.js'

import styles from '../page.module.css'

const Caption = dynamic(() => import('./Caption.js'))

import Form from './Form.js'

const SignUp = async () => {
  'use server'

  const { t } = await createTranslation('auth')

  return (
    <>
      <div className={styles['form-container']}>
        <h1 className={styles['form-title']}>{t('sign_up.title')}</h1>

        <Form />

        <p className={styles.msg}>
          <span>{t('already_account')}</span>
          <Link href="/sign-in" className={styles['ml-4']}>
            {t('sign_in')}
          </Link>
        </p>
      </div>
      <Caption />
    </>
  )
}

export default SignUp
