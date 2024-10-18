'use client'

import { useRouter } from 'next/navigation'

import { useTranslation } from '@/i18n/client.js'

import Button from '../common/Button/index.js'

import styles from './MobileAuthButtons.module.css'

const MobileAuthButtons = () => {
  const router = useRouter()

  const { t } = useTranslation('auth')

  return (
    <div className={styles['auth-buttons']}>
      <Button variant="gray" size="m" onClick={() => router.push('/sign-in')}>
        {t('sign_in')}
      </Button>
      <Button
        variant="primary"
        size="m"
        onClick={() => router.push('/sign-up')}
      >
        {t('sign_up')}
      </Button>
    </div>
  )
}

export default MobileAuthButtons
