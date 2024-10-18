import Link from 'next/link'

import { createTranslation } from '@/i18n/server.js'

import styles from './not-found.module.css'

import Header from '@/components/Header/index.js'

const NotFound = async () => {
  const { t } = await createTranslation('common')

  return (
    <>
      <Header />

      <main className={styles.main}>
        <h1 className={styles.title}>404 Not Found</h1>
        <p>
          <Link href="/">{t('back_to_home')}</Link>
        </p>
      </main>
    </>
  )
}

export default NotFound
