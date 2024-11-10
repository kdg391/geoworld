import { redirect } from 'next/navigation'

import { auth } from '@/auth.js'

import { getProfile } from '@/actions/profile.js'

import { createTranslation } from '@/i18n/server.js'

import styles from '../layout.module.css'

import DisplayNameForm from './DisplayNameForm.js'
import UsernameForm from './UsernameForm.js'

const Profile = async () => {
  'use server'

  const session = await auth()

  if (!session) redirect('/sign-in')

  const { data: profile, error } = await getProfile(session.user.id)

  if (!profile || error) redirect('/sign-in')
  if (!profile.display_name || !profile.username) redirect('/setup-profile')

  const { t } = await createTranslation(['profile', 'settings'])

  return (
    <section className={styles.section}>
      <h1 className="text-2xl mb-4">
        {t('profile_settings', {
          ns: 'settings',
        })}
      </h1>
      <section className={styles.setting}>
        <h2 className="text-xl mb-2">{t('display_name')}</h2>
        <div>
          <DisplayNameForm displayName={profile.display_name} />
        </div>
      </section>
      <section className={styles.setting}>
        <h2 className="text-xl mb-2">{t('username')}</h2>
        <div>
          <UsernameForm username={profile.username} />
        </div>
      </section>
    </section>
  )
}

export default Profile
