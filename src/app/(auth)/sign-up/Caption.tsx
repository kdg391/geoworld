'use client'

import Link from 'next/link'
import { Trans } from 'react-i18next'

import { useTranslation } from '@/i18n/client.js'

import styles from './Caption.module.css'

const Caption = () => {
  'use client'

  const { t } = useTranslation('auth')

  return (
    <p className={styles.caption}>
      <Trans
        i18nKey="sign_up.caption"
        t={t}
        components={[
          <Link key={0} href="/terms" />,
          <Link key={1} href="/privacy" />,
        ]}
      />
    </p>
  )
}

export default Caption
