'use server'

import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'

import { createTranslation } from '../../../i18n/server.js'

import styles from '../page.module.css'
import { createClient } from '../../../utils/supabase/server.js'

const Form = dynamic(() => import('./Form.js'))

const ResetPassword = async ({
  searchParams,
}: {
  searchParams: { code?: string }
}) => {
  if (!searchParams.code) return redirect('/')

  const supabase = createClient()

  try {
    await supabase.auth.exchangeCodeForSession(searchParams.code)
  } catch {
    redirect('/')
  }

  const { t } = await createTranslation('translation')

  return (
    <div className={styles['form-container']}>
      <h1 className={styles['form-title']}>{t('auth.resetPassword')}</h1>

      <Form />
    </div>
  )
}

export default ResetPassword
