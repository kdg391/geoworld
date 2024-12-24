'use client'

import { LogOut, Settings, UserRound } from 'lucide-react'
import Link from 'next/link.js'
import { useRouter } from 'next/navigation.js'
import { useEffect, useState } from 'react'

import { signOut } from '@/actions/auth.js'
import { getProfile } from '@/actions/profile.js'

import { useTranslation } from '@/i18n/client.js'

import styles from './MobileUserInfo.module.css'

import type { Session } from '@/lib/session.js'
import type { Profile } from '@/types/profile.js'
import type { User } from '@/types/user.js'

interface Props {
  session: Session
  user: User
}

const MobileUserInfo = ({ session, user }: Props) => {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)

  const [profile, setProfile] = useState<Pick<
    Profile,
    'id' | 'username' | 'displayName'
  > | null>(null)

  const { t } = useTranslation(['common', 'auth', 'settings'])

  useEffect(() => {
    const init = async () => {
      if (!session || !user) return

      const pCache = localStorage.getItem('profileCache')

      if (pCache !== null) {
        const profileCache = JSON.parse(pCache)

        if (Date.now() - profileCache.lastUpdated < 60 * 60 * 24 * 1000)
          setProfile(profileCache.data)

        return
      }

      const { data: pData } = await getProfile(user.id)

      if (
        pData === null ||
        pData.displayName === null ||
        pData.username === null
      )
        return

      setProfile({
        id: pData.id,
        displayName: pData.displayName,
        username: pData.username,
      })

      try {
        localStorage.setItem(
          'profileCache',
          JSON.stringify({
            data: {
              id: pData.id,
              displayName: pData.displayName,
              username: pData.username,
            },
            lastUpdated: Date.now(),
          }),
        )
      } catch {
        //
      }
    }

    init().then(() => setIsLoading(false))
  }, [])

  if (isLoading || !profile) return

  const onSignOutClick = async () => {
    if (localStorage.getItem('profileCache'))
      localStorage.removeItem('profileCache')

    try {
      await signOut()
    } finally {
      router.push('/')
    }
  }

  return (
    <div className={styles.container}>
      <Link href={`/user/${profile.id}`} className={styles.profile}>
        <div className="flex">
          <UserRound size={24} />
        </div>
        <div>
          <div className={styles['display-name']}>{profile.displayName}</div>
          <div className={styles.username}>@{profile.username}</div>
        </div>
      </Link>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link href="/dashboard" scroll={false}>
              {t('dashboard')}
            </Link>
          </li>
          <li>
            <Link
              href="/settings/profile"
              scroll={false}
              className={styles['with-icon']}
            >
              <UserRound size={18} />
              {t('profile_settings', {
                ns: 'settings',
              })}
            </Link>
          </li>
          <li>
            <Link
              href="/settings/account"
              scroll={false}
              className={styles['with-icon']}
            >
              <Settings size={18} />
              {t('account_settings', {
                ns: 'settings',
              })}
            </Link>
          </li>
          <li>
            <div onClick={onSignOutClick} className={styles['with-icon']}>
              <LogOut size={18} />
              {t('auth:sign_out')}
            </div>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default MobileUserInfo
