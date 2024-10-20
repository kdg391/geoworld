'use client'

import Link from 'next/link'

import { useTranslation } from '@/i18n/client.js'

import Button from '../common/Button/index.js'

import styles from './AuthButtons.module.css'

const AuthButtons = () => {
  const { t } = useTranslation('auth')

  return (
    <div className={styles['auth-buttons']}>
      <Link href="/sign-in">{t('sign_in')}</Link>
      <Button
        as="a"
        href="/sign-up"
        variant="primary"
        size="m"
        className="no-underline"
      >
        {t('sign_up')}
      </Button>
    </div>
  )
}

export default AuthButtons
