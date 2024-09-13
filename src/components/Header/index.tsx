'use client'

import { Menu, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { getUser } from '@/actions/user.js'

import { useTranslation } from '@/i18n/client.js'

import { classNames } from '@/utils/index.js'

import styles from './index.module.css'

import './index.css'

const UserInfo = dynamic(() => import('./UserInfo.js'))

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)

  const { t } = useTranslation('translation')

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
        error,
      } = await getUser()

      setIsSignedIn(user != null && error === null)
    }

    init()
  }, [])

  useEffect(() => {
    if (isMenuOpen) document.body.classList.add('scroll-locked')
    else document.body.classList.remove('scroll-locked')
  }, [isMenuOpen])

  return (
    <header className={classNames(styles.header, isMenuOpen ? 'active' : '')}>
      <div>
        <Link
          href={isSignedIn ? '/dashboard' : '/'}
          scroll={false}
          className={styles.title}
        >
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

        <div
          className={styles.backdrop}
          onClick={() => setIsMenuOpen((o) => !o)}
        ></div>
      </div>

      <UserInfo />

      <div>
        <button
          className={styles.menu}
          aria-label={t('menu')}
          onClick={() => setIsMenuOpen((o) => !o)}
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
    </header>
  )
}

export default Header
