import { redirect } from 'next/navigation'

import { createTranslation } from '@/i18n/server.ts'
import { getCurrentSession } from '@/lib/session.ts'
import GoogleApiProvider from '@/providers/GoogleApiProvider.tsx'

import styles from './page.module.css'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
  const { t } = await createTranslation('common')

  return {
    title: `${t('game')} - GeoWorld`,
  }
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { session } = await getCurrentSession()

  if (!session) return redirect('/sign-in')

  return (
    <GoogleApiProvider>
      <main className={styles.main}>{children}</main>
    </GoogleApiProvider>
  )
}
