'use client'

import Link from 'next/link'

import { useTranslation } from '@/i18n/client.js'

import Button from '../common/Button/index.js'

import styles from './AuthButtons.module.css'

const AuthButtons = () => {
  const { t } = useTranslation('auth')

  return (
    <div className={styles['auth-buttons']}>
      <Link href="/sign-in" className="hover:underline">
        {t('sign_in')}
      </Link>
      <Button as={Link} href="/sign-up" variant="primary" size="m">
        {t('sign_up')}
      </Button>
    </div>
  )
}

export default AuthButtons
