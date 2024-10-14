'use server'

import { redirect } from 'next/navigation'

import { auth } from '@/auth.js'

import { createTranslation } from '@/i18n/server.js'

import { createClient } from '@/utils/supabase/server.js'

import styles from '../layout.module.css'

import DeleteAccountButton from './DeleteAccountButton.js'
import EmailForm from './EmailForm.js'
import PasswordForm from './PasswordForm.js'

import type { User } from '@/types/index.js'

const Account = async () => {
  'use server'

  const session = await auth()

  if (!session) redirect('/sign-in')

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data: user, error: userErr } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single<User>()

  if (!user || userErr) redirect('/sign-in')

  const { t } = await createTranslation('auth')

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>Account Settings</h1>
      <section className={styles.setting}>
        <h2 className={styles['title-h2']}>{t('email')}</h2>
        <div>
          <EmailForm email={session.user.email} />
        </div>
      </section>
      {user.hashed_password && (
        <section className={styles.setting}>
          <h2 className={styles['title-h2']}>{t('password')}</h2>
          <div>
            <PasswordForm />
          </div>
        </section>
      )}
      <section className={styles.setting}>
        <h2 className={styles['title-h2']}>{t('delete_account')}</h2>
        <p>
          Clicking the Delete button will immediately delete the account. It
          cannot be reversed.
        </p>
        <div>
          <DeleteAccountButton />
        </div>
      </section>
    </section>
  )
}

export default Account
