'use client'

import { Heart, Home, MapPinned, Menu, Route, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { useTranslation } from '@/i18n/client.js'

import { classNames } from '@/utils/index.js'

import MobileAuthButtons from './MobileAuthButtons.js'
import MobileUserInfo from './MobileUserInfo.js'

import styles from './Header.module.css'

import type { Session } from '@/lib/session.js'
import type { User } from '@/types/user.js'

interface Props {
  session: Session
  user: User
}

const MobileMenu = ({ session, user }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { t } = useTranslation('common')

  return (
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
        <div className={styles['mobile-menu']}>
          <div className={styles['mobile-nav-wrapper']}>
            {session && user ? (
              <MobileUserInfo session={session} user={user} />
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
              </ul>
            </nav>

            {session !== null && (
              <nav className={styles['mobile-nav']}>
                <ul>
                  <li>
                    <Link href="/me/maps" className={styles['with-icon']}>
                      <MapPinned size={16} />
                      {t('my_maps')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/me/likes" className={styles['with-icon']}>
                      <Heart size={16} />
                      {t('liked_maps')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/me/ongoing-games"
                      className={styles['with-icon']}
                    >
                      <Route size={16} />
                      {t('ongoing_games')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/home" className={styles['with-icon']}>
                      <Home size={16} />
                      {t('home')}
                    </Link>
                  </li>
                </ul>
              </nav>
            )}
          </div>

          <div
            className={styles.backdrop}
            onClick={() => setIsMenuOpen((o) => !o)}
          ></div>
        </div>
      )}
    </div>
  )
}

export default MobileMenu
