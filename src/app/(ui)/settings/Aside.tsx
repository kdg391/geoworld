'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useTranslation } from '@/i18n/client.js'

import styles from './Aside.module.css'

import './Aside.css'

const Aside = () => {
  const { t } = useTranslation('common')

  const pathname = usePathname()

  return (
    <aside className={styles.aside}>
      <ul>
        <li>
          <Link
            href="/settings/profile"
            className={pathname === '/settings/profile' ? 'view' : ''}
          >
            {t('profile')}
          </Link>
        </li>
        <li>
          <Link
            href="/settings/account"
            className={pathname === '/settings/account' ? 'view' : ''}
          >
            {t('account')}
          </Link>
        </li>
        <li>
          <Link
            href="/settings/game"
            className={pathname === '/settings/game' ? 'view' : ''}
          >
            {t('game')}
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default Aside
