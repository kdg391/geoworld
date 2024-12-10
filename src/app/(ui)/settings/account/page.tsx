'use server'

import { redirect } from 'next/navigation'

import { getCurrentSession } from '@/session.js'

import { createTranslation } from '@/i18n/server.js'

import { createClient } from '@/utils/supabase/server.js'

import DeleteAccountButton from './DeleteAccountButton.js'
import EmailForm from './EmailForm.js'
import PasswordForm from './PasswordForm.js'

import styles from '../layout.module.css'

import type { APIAccount } from '@/types/account.js'

const Account = async () => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in')

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data: accountData } = await supabase
    .from('accounts')
    .select('*')
    .match({
      provider: 'credentials',
      user_id: user.id,
    })
    .single<APIAccount>()

  const { t } = await createTranslation(['account', 'settings'])

  return (
    <section className={styles.section}>
      <h1 className="text-2xl mb-4">
        {t('account_settings', {
          ns: 'settings',
        })}
      </h1>
      <section className={styles.setting}>
        <h2 className="text-xl mb-2">{t('email')}</h2>
        <div>
          <EmailForm email={user.email} />
        </div>
      </section>
      {accountData?.hashed_password && (
        <section className={styles.setting}>
          <h2 className="text-xl mb-2">{t('password')}</h2>
          <div>
            <PasswordForm />
          </div>
        </section>
      )}
      <section className={styles.setting}>
        <h2 className="text-xl mb-2">
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
