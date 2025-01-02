'use client'

import Link from 'next/link'
import { Trans } from 'react-i18next'

import { useTranslation } from '@/i18n/client.js'

import styles from './caption.module.css'

const Caption = () => {
  'use client'

  const { i18n, t } = useTranslation('auth')

  return (
    <p className={styles.caption}>
      <Trans
        i18n={i18n}
        i18nKey="caption"
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
