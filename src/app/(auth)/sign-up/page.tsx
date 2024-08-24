'use server'

import dynamic from 'next/dynamic'
import Link from 'next/link'

import { createTranslation } from '@/i18n/server.js'

import styles from '../page.module.css'

const Caption = dynamic(() => import('./Caption.js'))
const Form = dynamic(() => import('./Form.js'))

const SignUp = async () => {
  'use server'

  const { t } = await createTranslation('auth')

  return (
    <>
      <div className={styles['form-container']}>
        <h1 className={styles['form-title']}>{t('signUpTitle')}</h1>

        <Form />

        <p className={styles.msg}>
          <span>{t('alreadyAccount')}</span>
          <Link href="/sign-in" className={styles['ml-4']}>
            {t('signIn')}
          </Link>
        </p>
      </div>
      <Caption />
    </>
  )
}

export default SignUp
