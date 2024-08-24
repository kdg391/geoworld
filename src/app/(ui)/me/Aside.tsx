'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import styles from '../settings/Aside.module.css'
import '../settings/Aside.css'

const Aside = () => {
  const pathname = usePathname()

  return (
    <aside className={styles.aside}>
      <ul>
        <li>
          <Link
            href="/me/maps"
            className={pathname === '/me/maps' ? 'view' : ''}
          >
            My Maps
          </Link>
        </li>
        <li>
          <Link
            href="/me/likes"
            className={pathname === '/me/likes' ? 'view' : ''}
          >
            My Likes
          </Link>
        </li>
        <li>
          <Link
            href="/me/ongoing-games"
            className={pathname === '/me/ongoing-games' ? 'view' : ''}
          >
            Ongoing Games
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default Aside
