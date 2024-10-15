'use server'

import dynamic from 'next/dynamic'
import Link from 'next/link'

import { signInDiscord } from '@/actions/auth.js'

import { createTranslation } from '@/i18n/server.js'

import { classNames } from '@/utils/index.js'

import styles from '../page.module.css'

import '../page.css'

import Form from './Form.js'
import Discord from '@/components/icons/Discord.js'

const Caption = dynamic(() => import('../Caption.js'))

const SignUp = async () => {
  'use server'

  const { t } = await createTranslation('auth')

  return (
    <>
      <div className={styles['form-container']}>
        <h1 className={styles['form-title']}>{t('sign_up.title')}</h1>

        <div className={styles.providers}>
          <div>
            <form action={signInDiscord}>
              <button
                type="submit"
                className={classNames(styles['provider-btn'], 'discord')}
              >
                <Discord size={16} />
                {t('sign_up.discord')}
              </button>
            </form>
          </div>
          {/*<div>
            <Link
              href="/sign-in-sso"
              className={classNames(styles['provider-btn'], 'sso')}
            >
              <Mail size={16} />
              {t('sign_in.sso')}
            </Link>
          </div>*/}
        </div>

        <div className={styles.separator}>
          <hr />
          <span>or</span>
          <hr />
        </div>

        <Form />

        <p className={styles.msg}>
          <span>{t('already_account')}</span>
          <Link href="/sign-in" className={styles['ml-4']}>
            {t('sign_in')}
          </Link>
        </p>
      </div>
      <Caption />
    </>
  )
}

export default SignUp
