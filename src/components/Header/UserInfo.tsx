'use client'

import { LogOut, Map, Settings, UserRound } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { signOut } from '@/actions/auth.js'
import { getProfile } from '@/actions/profile.js'
import { getUser } from '@/actions/user.js'

import { ONE_DAY } from '@/constants/index.js'

import useClickOutside from '@/hooks/useClickOutside.js'

import { useTranslation } from '@/i18n/client.js'

import { classNames } from '@/utils/index.js'

import styles from './UserInfo.module.css'
import './UserInfo.css'

import type { Profile } from '@/types/index.js'

const NotSignedIn = dynamic(() => import('./NotSignedIn.js'))

const UserInfo = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useClickOutside(containerRef)

  const { t } = useTranslation('header')

  useEffect(() => {
    if (isDropdownOpen) document.body.classList.add('scroll-locked')
    else document.body.classList.remove('scroll-locked')
  }, [isDropdownOpen])

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
        error: uErr,
      } = await getUser()

      if (!user || uErr) return

      const pCache = localStorage.getItem('profileCache')
      const pCacheUpdated = localStorage.getItem('profileCacheUpdated')

      if (
        pCache &&
        pCacheUpdated &&
        Date.now() - parseInt(pCacheUpdated) < ONE_DAY * 1000
      ) {
        setProfile(JSON.parse(pCache))

        return
      }

      const { data: pData, error: pErr } = await getProfile(user.id)

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

  if (isLoading) return
  if (!profile) return <NotSignedIn />

  const onSignOutClick = async () => {
    if (localStorage.getItem('profileCache'))
      localStorage.removeItem('profileCache')
    if (localStorage.getItem('profileCacheUpdated'))
      localStorage.removeItem('profileCacheUpdated')

    try {
      await signOut()
    } finally {
      router.refresh()
      location.reload()
    }
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <span
        className={styles['display-name']}
        onClick={() => setIsDropdownOpen((o) => !o)}
      >
        {profile.display_name}
      </span>
      {createPortal(
        <ul
          className={classNames(
            styles.dropdown,
            isDropdownOpen ? 'active' : '',
          )}
        >
          <li>
            <Link href={`/user/${profile.id}`}>
              <UserRound size={18} />
              {t('profile')}
            </Link>
          </li>
          <li>
            <Link href="/dashboard">
              <Map size={18} />
              {t('dashboard')}
            </Link>
          </li>
          <li>
            <Link href="/settings/profile">
              <Settings size={18} />
              {t('settings')}
            </Link>
          </li>
          <li>
            <div onClick={onSignOutClick}>
              <LogOut size={18} />
              {t('signOut')}
            </div>
          </li>
        </ul>,
        document.body,
      )}
    </div>
  )
}

export default UserInfo
