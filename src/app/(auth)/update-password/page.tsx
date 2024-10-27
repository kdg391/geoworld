'use server'

import { createTranslation } from '@/i18n/server.js'

import styles from '../page.module.css'

import Form from './Form.js'

const UpdatePassword = async (props: {
  searchParams: Promise<{
    token?: string
  }>
}) => {
  'use server'

  const searchParams = await props.searchParams

  if (!searchParams.token) return

  const { t } = await createTranslation('auth')

  return (
    <div className={styles['form-container']}>
      <h1 className={styles['form-title']}>{t('update_password')}</h1>

      <Form token={searchParams.token} />
    </div>
  )
}

export default UpdatePassword
