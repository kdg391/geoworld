import Link from 'next/link'

import { createTranslation } from '@/i18n/server.js'

import styles from './index.module.css'

import './index.css'

const AuthFooter = async () => {
  const { t } = await createTranslation('translation')

  return (
    <footer className={styles.footer}>
      <nav>
        <ul className={styles.links}>
          <li>
            <Link href="/terms">{t('terms')}</Link>
          </li>
          <li>
            <Link href="/privacy">{t('privacy')}</Link>
          </li>
        </ul>
      </nav>
    </footer>
  )
}

export default AuthFooter
