'use client'

import { Menu, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { useTranslation } from '../../i18n/client.js'

import { classNames } from '../../utils/index.js'

import styles from './index.module.css'
import './index.css'

const UserInfo = dynamic(() => import('./UserInfo.js'))

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { t } = useTranslation('header')

  useEffect(() => {
    if (isMenuOpen) document.body.style.setProperty('overflow-y', 'hidden')
    else document.body.style.removeProperty('overflow-y')
  }, [isMenuOpen])

  return (
    <header className={classNames(styles.header, isMenuOpen ? 'active' : '')}>
      <div>
        <Link href="/" scroll={false} className={styles.title}>
          <Image
            src="/assets/icons/icon.svg"
            width={18}
            height={18}
            alt="Logo"
          />
          GeoWorld
        </Link>
      </div>

      <div className={styles['nav-wrapper']}>
        <nav>
          <ul className={styles.links}>
            <li>
              <Link href="/maps" scroll={false}>
                {t('maps')}
              </Link>
            </li>
          </ul>
        </nav>

        <UserInfo />

        <div
          className={styles.backdrop}
          onClick={() => setIsMenuOpen((o) => !o)}
        />
      </div>

      <button
        className={styles.menu}
        aria-label={t('menu')}
        onClick={() => setIsMenuOpen((o) => !o)}
      >
        {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
    </header>
  )
}

export default Header
