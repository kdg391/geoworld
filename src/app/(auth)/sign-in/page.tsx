import { Mail } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import { signInDiscord } from '@/actions/auth.js'

import { createTranslation } from '@/i18n/server.js'

import styles from '../page.module.css'

import '../page.css'

import { classNames } from '@/utils/index.js'

import Form from './Form.js'
import Discord from '@/components/icons/Discord.js'

const Caption = dynamic(() => import('../Caption.js'))

const SignIn = async () => {
  'use server'

  const { t } = await createTranslation('auth')

  return (
    <>
      <div className={styles['form-container']}>
        <h1 className={styles['form-title']}>{t('sign_in.title')}</h1>

        <div className={styles.providers}>
          <div>
            <form action={signInDiscord}>
              <button
                type="submit"
                className={classNames(styles['provider-btn'], 'discord')}
              >
                <Discord size={16} />
                {t('continue_with_discord')}
              </button>
            </form>
          </div>
          <div>
            <Link
              href="/sign-in-email"
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
          <span>{t('do_not_have_account')}</span>
          <Link href="/sign-up" className={styles['ml-4']}>
            {t('sign_up')}
          </Link>
        </p>
      </div>
      <Caption />
    </>
  )
}

export default SignIn
