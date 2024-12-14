'use server'

import { notFound } from 'next/navigation.js'

import { createTranslation } from '@/i18n/server.js'

import { createClient } from '@/utils/supabase/server.js'

import Form from './Form.js'

import styles from '../../page.module.css'

const ResetPassword = async (props: {
  params: Promise<{
    token: string
  }>
}) => {
  'use server'

  const params = await props.params

  const supabase = createClient({
    serviceRole: true,
  })

  const { data } = await supabase
    .from('password_reset_tokens')
    .select('id')
    .eq('token', params.token)
    .maybeSingle()

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
