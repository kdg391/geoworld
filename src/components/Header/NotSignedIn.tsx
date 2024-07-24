'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import { useTranslation } from '../../i18n/client.js'

import styles from './NotSignedIn.module.css'

const Button = dynamic(() => import('../common/Button/index.js'))

const NotSignedIn = () => {
  const router = useRouter()

  const { t } = useTranslation('translation')

  return (
    <div className={styles.notSigned}>
      <Button
        variant="secondary"
        size="m"
        onClick={() => router.push('/sign-in')}
      >
        {t('auth.signIn')}
      </Button>
      <Button
        variant="primary"
        size="m"
        onClick={() => router.push('/sign-up')}
      >
        {t('auth.signUp')}
      </Button>
    </div>
  )
}

export default NotSignedIn
