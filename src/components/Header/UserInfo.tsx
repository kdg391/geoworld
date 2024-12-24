'use client'

import { LogOut, Settings, UserRound } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { signOut } from '@/actions/auth.js'
import { getProfile } from '@/actions/profile.js'

import useClickOutside from '@/hooks/useClickOutside.js'

import { useTranslation } from '@/i18n/client.js'

import { classNames } from '@/utils/index.js'

import styles from './UserInfo.module.css'

import './UserInfo.css'

import type { Session } from '@/lib/session.js'
import type { Profile } from '@/types/profile.js'
import type { User } from '@/types/user.js'

interface Props {
  session: Session | null
  user: User | null
}

const UserInfo = ({ session, user }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<Pick<
    Profile,
    'id' | 'displayName' | 'username'
  > | null>(null)

  const [isDropdownOpen, setIsDropdownOpen] = useClickOutside(containerRef)

  const { t } = useTranslation(['common', 'auth'])

  useEffect(() => {
    if (isDropdownOpen) document.body.classList.add('scroll-locked')
    else document.body.classList.remove('scroll-locked')
  }, [isDropdownOpen])

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
  }, [session, user])

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
    <div className={styles.container} ref={containerRef}>
      <div
        className={styles['display-name']}
        onClick={() => setIsDropdownOpen((o) => !o)}
      >
        {profile.displayName}
      </div>

      <ul
        className={classNames(styles.dropdown, isDropdownOpen ? 'active' : '')}
      >
        <li>
          <Link href={`/user/${profile.id}`} scroll={false}>
            <UserRound size={18} />
            {t('profile')}
          </Link>
        </li>
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
    </div>
  )
}

export default UserInfo
