'use client'

import { LogOut, Settings, UserRound } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { signOut } from '../../actions/auth.js'
import { getProfile } from '../../actions/profile.js'
import { getUser } from '../../actions/user.js'

import { ONE_DAY } from '../../constants/index.js'

import { useTranslation } from '../../i18n/client.js'

import { classNames } from '../../utils/index.js'

import styles from './UserInfo.module.css'
import './UserInfo.css'

import type { Profile } from '../../types/index.js'

const NotSignedIn = dynamic(() => import('./NotSignedIn.js'))

const UserInfo = () => {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const dropdownRef = useRef<HTMLUListElement | null>(null)

  const { t } = useTranslation('translation')

  useEffect(() => {
    const init = async () => {
      const { data, error: uErr } = await getUser()

      if (!data.user || uErr) return

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

      const { data: pData, error: pErr } = await getProfile(data.user.id)

      if (!pData || pErr) return

      setProfile(pData)

      try {
        localStorage.setItem(
          'profileCache',
          JSON.stringify({
            id: pData.id,
            display_name: pData.display_name,
          }),
        )
        localStorage.setItem('profileCacheUpdated', String(Date.now()))
      } catch {
        //
      }
    }

    init().then(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!dropdownRef.current) return
    if (!containerRef.current) return

    const onClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as HTMLUListElement)
      ) {
        setDropdownOpen(false)
      }
    }

    window.addEventListener('click', onClick)

    return () => window.removeEventListener('click', onClick)
  }, [])

  if (loading) return
  if (!profile) return <NotSignedIn />

  return (
    <div className={styles.container} ref={containerRef}>
      <span
        className={styles['display-name']}
        onClick={() => setDropdownOpen((o) => !o)}
      >
        {profile.display_name}
      </span>
      <ul
        className={classNames(styles.dropdown, dropdownOpen ? 'active' : '')}
        ref={dropdownRef}
      >
        <li onClick={() => router.push(`/user/${profile.id}`)}>
          <UserRound size={18} />
          {t('header.profile')}
        </li>
        <li onClick={() => router.push('/account/settings')}>
          <Settings size={18} />
          {t('header.settings')}
        </li>
        <li
          onClick={async () => {
            try {
              if (localStorage.getItem('profileCache'))
                localStorage.removeItem('profileCache')
              if (localStorage.getItem('profileCacheUpdated'))
                localStorage.removeItem('profileCacheUpdated')

              await signOut()

              router.refresh()
            } catch {}
          }}
        >
          <LogOut size={18} />
          {t('header.signOut')}
        </li>
      </ul>
    </div>
  )
}

export default UserInfo
