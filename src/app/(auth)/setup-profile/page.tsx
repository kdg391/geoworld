'use server'

import { redirect } from 'next/navigation'

import { auth } from '@/auth.js'

import { createTranslation } from '@/i18n/server.js'

import { createClient } from '@/utils/supabase/server.js'

import Form from './Form.js'

import styles from '../page.module.css'

import type { Profile } from '@/types/index.js'

const SetupProfile = async () => {
  'use server'

  const session = await auth()

  if (!session) redirect('/sign-in')

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single<Profile>()

  if (!profile) redirect('/sign-in')

  if (profile.display_name && profile.username) redirect('/dashboard')

  const { t } = await createTranslation('profile')

  return (
    <div className={styles['form-container']}>
      <h1 className={styles['form-title']}>{t('setup_profile')}</h1>

      <Form />
    </div>
  )
}

export default SetupProfile
