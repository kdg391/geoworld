'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useTranslation } from '@/i18n/client.js'

import styles from './NotSignedIn.module.css'

import Button from '../common/Button/index.js'

const NotSignedIn = () => {
  const router = useRouter()

  const { t } = useTranslation('auth')

  return (
    <div className={styles.notSigned}>
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

export default NotSignedIn
