'use server'

import { createTranslation } from '@/i18n/server.js'

import styles from '../page.module.css'

import Form from './Form.js'

const UpdatePassword = async ({
  searchParams,
}: {
  searchParams: { code?: string }
}) => {
  'use server'

  if (!searchParams.code) return

  const { t } = await createTranslation('auth')

  return (
    <div className={styles['form-container']}>
      <h1 className={styles['form-title']}>{t('update_password')}</h1>

      <Form code={searchParams.code} />
    </div>
  )
}

export default UpdatePassword
