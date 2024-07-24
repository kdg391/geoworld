'use client'

import { Menu, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { classNames } from '../../utils/index.js'

import styles from './index.module.css'
import './index.css'

const ThemeSelect = dynamic(() => import('./ThemeSelect.js'), {
  ssr: false,
})
const UserInfo = dynamic(() => import('./UserInfo.js'))

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (isMenuOpen) document.body.style.setProperty('overflow-y', 'hidden')
    else document.body.style.removeProperty('overflow-y')
  }, [isMenuOpen])

  return (
    <header className={classNames(styles.header, isMenuOpen ? 'active' : '')}>
      <div>
        <h2>
          <Link href="/" scroll={false}>
            <Image
              src="/assets/icons/icon.avif"
              width={18}
              height={18}
              alt="Logo"
            />
            GeoWorld
          </Link>
        </h2>
      </div>

      <div className={styles['nav-wrapper']}>
        <nav>
          <ul className={styles.links}>
            <li>
              <Link href="/maps" scroll={false}>
                Maps
              </Link>
            </li>
          </ul>
        </nav>

        <ThemeSelect />

        <UserInfo />

        <div
          className={styles.backdrop}
          onClick={() => setIsMenuOpen((o) => !o)}
        />
      </div>

      <button
        className={styles.menu}
        aria-label="Menu"
        onClick={() => setIsMenuOpen((o) => !o)}
      >
        {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
    </header>
  )
}

export default Header
