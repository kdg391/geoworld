'use server'

import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server.js'

import styles from '../layout.module.css'

const EmailForm = dynamic(() => import('./EmailForm.js'))
const PasswordForm = dynamic(() => import('./PasswordForm.js'))

const Account = async () => {
  'use server'

  const supabase = createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) return redirect('/sign-in')

  return (
    <section className={styles.section}>
      <h1>Account Settings</h1>
      <div>
        <h2>Email</h2>
        <div>
          <EmailForm email={user.email} />
        </div>
      </div>
      <h2>Password</h2>
      <div>
        <PasswordForm />
      </div>
    </section>
  )
}

export default Account
