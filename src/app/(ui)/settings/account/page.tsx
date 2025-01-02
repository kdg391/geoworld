'use server'

import { redirect } from 'next/navigation'

import { createTranslation } from '@/i18n/server.js'

import { getCurrentSession } from '@/lib/session.js'

import { createClient } from '@/utils/supabase/server.js'

import DeleteAccountButton from './DeleteAccountButton.js'
import EmailForm from './email-form.js'
import PasswordForm from './password-form.js'
import SessionManager from './session-manager.js'

import styles from '../layout.module.css'

import type { APIAccount } from '@/types/account.js'

const Account = async () => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in?next=/settings/account')

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data: credentialsData } = await supabase
    .from('accounts')
    .select('*')
    .match({
      provider: 'credentials',
      user_id: user.id,
    })
    .maybeSingle<APIAccount>()

  const { t } = await createTranslation(['account', 'settings'])

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>
        {t('account_settings', {
          ns: 'settings',
        })}
      </h1>
      <section className={styles.setting}>
        <h2 className={styles['setting-title']}>{t('email')}</h2>
        <div>
          <EmailForm email={user.email} />
        </div>
      </section>
      {credentialsData?.hashed_password && (
        <section className={styles.setting}>
          <h2 className={styles['setting-title']}>{t('password')}</h2>
          <div>
            <PasswordForm />
          </div>
        </section>
      )}
      <section className={styles.setting}>
        <h2 className={styles['setting-title']}>Sessions</h2>
        <SessionManager />
      </section>
      <section className={styles.setting}>
        <h2 className={styles['setting-title']}>
          {t('delete_account', {
            ns: 'settings',
          })}
        </h2>
        <p className="mb-2">
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
