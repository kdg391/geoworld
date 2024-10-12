'use client'

import { Menu, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { useTranslation } from '@/i18n/client.js'

import { classNames } from '@/utils/index.js'

import styles from './index.module.css'

import './index.css'

import type { Session } from 'next-auth'

const UserInfo = dynamic(() => import('./UserInfo.js'))

interface Props {
  session: Session | null
}

const HeaderClient = ({ session }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { t } = useTranslation('common')

  useEffect(() => {
    if (isMenuOpen) document.body.classList.add('scroll-locked')
    else document.body.classList.remove('scroll-locked')
  }, [isMenuOpen])

  return (
    <header className={classNames(styles.header, isMenuOpen ? 'active' : '')}>
      <div>
        <Link
          href={session !== null ? '/dashboard' : '/'}
          scroll={false}
          style={{
            display: 'flex',
          }}
        >
          <Image
            src="/assets/light.svg"
            width={124}
            height={24}
            alt="GeoWorld Logo"
            className="dark-hidden"
            priority
          />
          <Image
            src="/assets/dark.svg"
            width={124}
            height={24}
            alt="GeoWorld Logo"
            className="light-hidden"
            priority
          />
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

      <div>
        <button
          className={styles.menu}
          aria-label={t('menu')}
          onClick={() => setIsMenuOpen((o) => !o)}
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <UserInfo session={session} />
    </header>
  )
}

export default HeaderClient
