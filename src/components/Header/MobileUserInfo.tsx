'use client'

import { LogOut, Settings, UserRound } from 'lucide-react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

import { getProfile } from '@/actions/profile.js'

import { useTranslation } from '@/i18n/client.js'

import styles from './MobileUserInfo.module.css'

import type { Session } from 'next-auth'
import type { Profile } from '@/types/index.js'

interface Props {
  session: Session
}

const MobileUserInfo = ({ session }: Props) => {
  const [isLoading, setIsLoading] = useState(true)

  const [profile, setProfile] = useState<Pick<
    Profile,
    'id' | 'username' | 'display_name'
  > | null>(null)

  const { t } = useTranslation(['common', 'auth'])

  useEffect(() => {
    const init = async () => {
      const pCache = localStorage.getItem('profileCache')
      const pCacheUpdated = localStorage.getItem('profileCacheUpdated')

      if (
        pCache &&
        pCacheUpdated &&
        Date.now() - parseInt(pCacheUpdated) < 60 * 60 * 24 * 1000
      ) {
        setProfile(JSON.parse(pCache))

        return
      }

      const { data: pData, error: pErr } = await getProfile(session.user.id)

      if (!pData || pErr) return

      setProfile(pData)

      try {
        localStorage.setItem(
          'profileCache',
          JSON.stringify({
            id: pData.id,
            display_name: pData.display_name,
            username: pData.username,
          }),
        )
        localStorage.setItem('profileCacheUpdated', String(Date.now()))
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
    if (localStorage.getItem('profileCacheUpdated'))
      localStorage.removeItem('profileCacheUpdated')

    try {
      await signOut()
    } catch {}
  }

  return (
    <div className={styles.container}>
      <Link href={`/user/${profile.id}`} className={styles.profile}>
        <div className="flex">
          <UserRound size={24} />
        </div>
        <div>
          <div>{profile.display_name}</div>
          <div className={styles.username}>@{profile.username}</div>
        </div>
      </Link>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link href="/settings/profile" scroll={false}>
              <Settings size={18} />
              {t('settings')}
            </Link>
          </li>
          <li>
            <div onClick={onSignOutClick}>
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
