'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useTranslation } from '@/i18n/client.js'

import styles from './NotSignedIn.module.css'

const Button = dynamic(() => import('../common/Button/index.js'))

const NotSignedIn = () => {
  const router = useRouter()

  const { t } = useTranslation('auth')

  return (
    <div className={styles.notSigned}>
      <Link href="/sign-in">{t('signIn')}</Link>
      <Button
        variant="primary"
        size="m"
        onClick={() => router.push('/sign-up')}
      >
        {t('signUp')}
      </Button>
    </div>
  )
}

export default NotSignedIn
