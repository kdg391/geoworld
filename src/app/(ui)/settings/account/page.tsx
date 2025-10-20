'use server'

import { and, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db/index.ts'
import { accountsTable } from '@/db/schema.ts'
import { createTranslation } from '@/i18n/server.ts'
import { getCurrentSession } from '@/lib/session.ts'

import styles from '../layout.module.css'

import DeleteAccountButton from './DeleteAccountButton.tsx'
import EmailForm from './email-form.tsx'
import PasswordForm from './password-form.tsx'
import SessionManager from './session-manager.tsx'

const Account = async () => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in?next=/settings/account')

  const credentialsResult = await db
    .select()
    .from(accountsTable)
    .where(
      and(
        eq(accountsTable.provider, 'credentials'),
        eq(accountsTable.userId, user.id),
      ),
    )

  const credentialsData = credentialsResult[0] ?? null

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
      {credentialsData?.hashedPassword && (
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
