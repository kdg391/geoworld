import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'

import { getProfile } from '@/actions/profile.js'

import { createClient } from '@/utils/supabase/server.js'

import styles from '../layout.module.css'

const DisplayNameForm = dynamic(() => import('./DisplayNameForm.js'))
const UsernameForm = dynamic(() => import('./UsernameForm.js'))

const Profile = async () => {
  'use server'

  const supabase = createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) return redirect('/sign-in')

  const { data: pData, error: pErr } = await getProfile(user.id)

  if (!pData || pErr) return redirect('/sign-in')

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>Profile Settings</h1>
      <section className={styles.setting}>
        <h2>Display Name</h2>
        <div>
          <DisplayNameForm displayName={pData.display_name} />
        </div>
      </section>
      <section className={styles.setting}>
        <h2>Username</h2>
        <div>
          <UsernameForm username={pData.username} />
        </div>
      </section>
    </section>
  )
}

export default Profile
