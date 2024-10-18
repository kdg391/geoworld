'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useTranslation } from '@/i18n/client.js'

import Button from '../common/Button/index.js'

import styles from './AuthButtons.module.css'

const AuthButtons = () => {
  const router = useRouter()

  const { t } = useTranslation('auth')

  return (
    <div className={styles['auth-buttons']}>
      <Link href="/sign-in">{t('sign_in')}</Link>
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

export default AuthButtons
