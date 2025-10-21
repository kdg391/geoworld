import { redirect } from 'next/navigation'

import { createTranslation } from '@/i18n/server.ts'
import { getCurrentSession } from '@/lib/session.ts'

import styles from './page.module.css'

import Form from './form.tsx'

import './page.css'

const SignIn = async () => {
  'use server'

  const { session } = await getCurrentSession()

  if (session) redirect('/')

  const { t } = await createTranslation('auth')

  return (
    <div className={styles['form-container']}>
      <h1 className={styles['form-title']}>{t('sign_in.title')}</h1>

      <Form />
    </div>
  )
}

export default SignIn
