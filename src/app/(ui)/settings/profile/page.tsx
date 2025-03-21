import { redirect } from 'next/navigation'

import { getProfile } from '@/actions/profile.js'

import { createTranslation } from '@/i18n/server.js'

import { getCurrentSession } from '@/lib/session.js'

import DisplayNameForm from './display-name-form.js'
import UsernameForm from './username-form.js'

import styles from '../layout.module.css'

const Profile = async () => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in?next=/settings/profile')

  const { data: profile } = await getProfile(user.id)

  if (profile === null) redirect('/sign-in')
  if (profile.displayName === null || profile.username === null)
    redirect('/setup-profile')

  const { t } = await createTranslation(['profile', 'settings'])

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>
        {t('profile_settings', {
          ns: 'settings',
        })}
      </h1>
      <section className={styles.setting}>
        <h2 className={styles['setting-title']}>{t('display_name')}</h2>
        <div>
          <DisplayNameForm displayName={profile.displayName} />
        </div>
      </section>
      <section className={styles.setting}>
        <h2 className={styles['setting-title']}>{t('username')}</h2>
        <div>
          <UsernameForm username={profile.username} />
        </div>
      </section>
    </section>
  )
}

export default Profile
