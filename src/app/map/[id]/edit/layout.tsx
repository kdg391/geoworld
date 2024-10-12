import { SessionProvider } from 'next-auth/react'

import { createTranslation } from '@/i18n/server.js'

import GoogleApiProvider from '@/providers/GoogleApiProvider.js'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
  const { t } = await createTranslation('common')

  return {
    title: `${t('edit_map')} - GeoWorld`,
  }
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <GoogleApiProvider>
      <SessionProvider>{children}</SessionProvider>
    </GoogleApiProvider>
  )
}
