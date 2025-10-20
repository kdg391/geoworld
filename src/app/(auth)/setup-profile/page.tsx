'use server'

import { redirect } from 'next/navigation'

import { getProfile } from '@/actions/profile.ts'
import { createTranslation } from '@/i18n/server.ts'
import { getCurrentSession } from '@/lib/session.ts'

import styles from '../page.module.css'

import Form from './form.tsx'

const SetupProfile = async () => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in')

  const { data: profile } = await getProfile(user.id)

  if (
    profile !== null &&
    profile.displayName !== null &&
    profile.username !== null
  )
    redirect('/dashboard')

  const { t } = await createTranslation('profile')

  return (
    <div className={styles['form-container']}>
      <h1 className={styles['form-title']}>{t('setup_profile')}</h1>

      <Form />
    </div>
  )
}

export default SetupProfile
