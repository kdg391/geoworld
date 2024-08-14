'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Aside = () => {
  const pathname = usePathname()

  return (
    <aside className={''}>
      <ul>
        <li>
          <Link
            href="/dashboard"
            className={pathname === '/dashboard' ? 'view' : ''}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/maps"
            className={pathname === '/dashboard/maps' ? 'view' : ''}
          >
            Maps
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/likes"
            className={pathname === '/dashboard/likes' ? 'view' : ''}
          >
            Likes
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default Aside
