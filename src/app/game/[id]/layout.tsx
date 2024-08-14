import { redirect } from 'next/navigation'

import GoogleApiProvider from '@/providers/GoogleApiProvider.js'

import { createClient } from '@/utils/supabase/server.js'

import styles from './page.module.css'

import type { Metadata } from 'next'
import { createTranslation } from '@/i18n/server.js'

export const generateMetadata = async (): Promise<Metadata> => {
  const { t } = await createTranslation('translation')

  return {
    title: `${t('game')} - GeoWorld`,
  }
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser()

  if (!user || uErr) redirect('/sign-in')

  return (
    <GoogleApiProvider>
      <main className={styles.main}>{children}</main>
    </GoogleApiProvider>
  )
}
