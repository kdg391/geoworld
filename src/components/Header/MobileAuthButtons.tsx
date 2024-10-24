'use client'

import Link from 'next/link'

import { useTranslation } from '@/i18n/client.js'

import Button from '../common/Button/index.js'

import styles from './MobileAuthButtons.module.css'

const MobileAuthButtons = () => {
  const { t } = useTranslation('auth')

  return (
    <div className={styles['auth-buttons']}>
      <Button as={Link} href="/sign-in" variant="gray" size="m">
        {t('sign_in')}
      </Button>
      <Button as={Link} href="/sign-up" variant="primary" size="m">
        {t('sign_up')}
      </Button>
    </div>
  )
}

export default MobileAuthButtons
