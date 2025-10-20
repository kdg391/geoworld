import { createTranslation } from '@/i18n/server.ts'

import GoogleApiProvider from '@/providers/GoogleApiProvider.tsx'

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
      <main className="w-full h-full">{children}</main>
    </GoogleApiProvider>
  )
}
