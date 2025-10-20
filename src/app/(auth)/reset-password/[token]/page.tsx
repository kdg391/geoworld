'use server'

import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'

import { db } from '@/db/index.ts'
import { passwordResetTokensTable } from '@/db/schema.ts'
import { createTranslation } from '@/i18n/server.ts'

import styles from '../../page.module.css'

import Form from './form.tsx'

const ResetPassword = async (props: {
  params: Promise<{
    token: string
  }>
}) => {
  'use server'

  const params = await props.params

  const result = await db
    .select({
      id: passwordResetTokensTable.id,
    })
    .from(passwordResetTokensTable)
    .where(eq(passwordResetTokensTable.token, params.token))

  const data = result[0] ?? null

  if (data === null) notFound()

  const { t } = await createTranslation('auth')

  return (
    <div className={styles['form-container']}>
      <h1 className={styles['form-title']}>{t('update_password')}</h1>

      <Form token={params.token} />
    </div>
  )
}

export default ResetPassword
