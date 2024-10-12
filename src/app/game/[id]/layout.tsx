import { createTranslation } from '@/i18n/server.js'

import GoogleApiProvider from '@/providers/GoogleApiProvider.js'

import styles from './page.module.css'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
  const { t } = await createTranslation('common')

  return {
    title: `${t('game')} - GeoWorld`,
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <GoogleApiProvider>
      <main className={styles.main}>{children}</main>
    </GoogleApiProvider>
  )
}
