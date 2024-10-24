'use client'

import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { useTranslation } from '@/i18n/client.js'

import { classNames } from '@/utils/index.js'

import AuthButtons from './AuthButtons.js'
import MobileAuthButtons from './MobileAuthButtons.js'
import MobileUserInfo from './MobileUserInfo.js'
import UserInfo from './UserInfo.js'

import styles from './Header.module.css'

import './Header.css'

import type { Session } from 'next-auth'

interface Props {
  session: Session | null
}

const HeaderClient = ({ session }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { t } = useTranslation(['common', 'auth'])

  useEffect(() => {
    if (isMenuOpen) document.body.classList.add('scroll-locked')
    else document.body.classList.remove('scroll-locked')
  }, [isMenuOpen])

  return (
    <header className={styles.header}>
      <div>
        <Link
          href={session !== null ? '/dashboard' : '/'}
          scroll={false}
          className="flex"
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

        {session ? <UserInfo session={session} /> : <AuthButtons />}
      </div>

      {/* Mobile */}
      <div
        className={classNames(
          styles['mobile-menu-container'],
          isMenuOpen ? 'active' : '',
        )}
      >
        <button
          className={styles['mobile-menu-btn']}
          aria-label={t('menu')}
          onClick={() => setIsMenuOpen((o) => !o)}
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {isMenuOpen && (
          <>
            <div className={styles['mobile-menu']}>
              <div className={styles['mobile-nav-wrapper']}>
                {session ? (
                  <MobileUserInfo session={session} />
                ) : (
                  <MobileAuthButtons />
                )}

                <nav className={styles['mobile-nav']}>
                  <ul>
                    <li>
                      <Link href="/maps" scroll={false}>
                        {t('maps')}
                      </Link>
                    </li>
                    {session !== null && (
                      <>
                        <li>
                          <Link href="/me/likes">Liked Maps</Link>
                        </li>
                        <li>
                          <Link href="/me/maps">Your Maps</Link>
                        </li>
                        <li>
                          <Link href="/me/omgoing-games">Ongoing Games</Link>
                        </li>
                        <li>
                          <Link href="/home">{t('home')}</Link>
                        </li>
                      </>
                    )}
                  </ul>
                </nav>
              </div>

              <div
                className={styles.backdrop}
                onClick={() => setIsMenuOpen((o) => !o)}
              ></div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

export default HeaderClient
