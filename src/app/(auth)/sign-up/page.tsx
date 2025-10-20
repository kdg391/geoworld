'use server'

import '../page.css'

import { Mail } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import Discord from '@/components/icons/Discord.tsx'
import { createTranslation } from '@/i18n/server.ts'
import { classNames } from '@/utils/index.ts'

import styles from '../page.module.css'

import Form from './form.tsx'

const Caption = dynamic(() => import('../caption.tsx'))

const SignUp = async () => {
  'use server'

  const { t } = await createTranslation('auth')

  return (
    <>
      <div className={styles['form-container']}>
        <h1 className={styles['form-title']}>{t('sign_up.title')}</h1>

        <div className={styles.providers}>
          <div>
            <Link
              href="/sign-in/discord"
              className={classNames(styles['provider-btn'], 'discord')}
            >
              <Discord size={16} />
              {t('continue_with_discord')}
            </Link>
          </div>
          <div>
            <Link
              href="/sign-in/email"
              className={classNames(styles['provider-btn'], 'email')}
            >
              <Mail size={16} />
              {t('continue_with_email')}
            </Link>
          </div>
        </div>

        <div className={styles.separator}>
          <hr />
          <span>or</span>
          <hr />
        </div>

        <Form />

        <p className={styles.msg}>
          <span>{t('already_account')}</span>
          <Link href="/sign-in" className="ml-1">
            {t('sign_in')}
          </Link>
        </p>
      </div>

      <Caption />
    </>
  )
}

export default SignUp
