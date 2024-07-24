'use server'

import dynamic from 'next/dynamic'
import Link from 'next/link'

import { createTranslation } from '../../../i18n/server.js'

import styles from '../page.module.css'

const Form = dynamic(() => import('./Form.js'))

const SignUp = async () => {
  'use server'
  const { t } = await createTranslation('translation')

  return (
    <>
      <div className={styles['form-container']}>
        <h1 className={styles['form-title']}>{t('auth.signUpTitle')}</h1>

        <Form />

        <p>
          <span>{t('auth.alreadyAccount')}</span>
          <Link
            href="/sign-in"
            style={{
              marginLeft: '4px',
            }}
          >
            {t('auth.signIn')}
          </Link>
        </p>
      </div>
      <p
        style={{
          fontSize: '0.875rem',
          textAlign: 'center',
          wordBreak: 'break-word',
          maxWidth: '20rem',
        }}
      >
        By continuing, you agree to the{' '}
        <Link href="/terms-of-service">Terms of Service</Link> and{' '}
        <Link href="/privacy-policy">Privacy Policy</Link>
      </p>
    </>
  )
}

export default SignUp
