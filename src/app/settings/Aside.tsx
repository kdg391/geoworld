'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import styles from './Aside.module.css'
import './Aside.css'

const Aside = () => {
  const pathname = usePathname()

  return (
    <aside className={styles.aside}>
      <ul>
        <li>
          <Link
            href="/settings/profile"
            className={pathname === '/settings/profile' ? 'view' : ''}
          >
            Profile
          </Link>
        </li>
        <li>
          <Link
            href="/settings/account"
            className={pathname === '/settings/account' ? 'view' : ''}
          >
            Account
          </Link>
        </li>
        <li>
          <Link
            href="/settings/game"
            className={pathname === '/settings/game' ? 'view' : ''}
          >
            Game
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default Aside
