'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useTranslation } from '@/i18n/client.js'

import styles from '../settings/Aside.module.css'

import '../settings/Aside.css'

const Aside = () => {
  const pathname = usePathname()

  const { t } = useTranslation('common')

  return (
    <aside className={styles.aside}>
      <ul>
        <li>
          <Link
            href="/me/maps"
            className={pathname === '/me/maps' ? 'view' : ''}
          >
            {t('my_maps')}
          </Link>
        </li>
        <li>
          <Link
            href="/me/likes"
            className={pathname === '/me/likes' ? 'view' : ''}
          >
            {t('liked_maps')}
          </Link>
        </li>
        <li>
          <Link
            href="/me/ongoing-games"
            className={pathname === '/me/ongoing-games' ? 'view' : ''}
          >
            {t('ongoing_games')}
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default Aside
