'use server'

import { redirect } from 'next/navigation'

import { auth } from '@/auth.js'

import styles from '../layout.module.css'

import EmailForm from './EmailForm.js'
import PasswordForm from './PasswordForm.js'

const Account = async () => {
  'use server'

  const session = await auth()

  if (!session) redirect('/sign-in')

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>Account Settings</h1>
      <section className={styles.setting}>
        <h2>Email</h2>
        <div>
          <EmailForm email={session.user.email} />
        </div>
      </section>
      <section className={styles.setting}>
        <h2>Password</h2>
        <div>
          <PasswordForm />
        </div>
      </section>
    </section>
  )
}

export default Account
