import { createTranslation } from '../../i18n/server.js'

import GoogleApiProvider from '../../providers/GoogleApiProvider.js'

import type { Metadata } from 'next'

export const metadata = async (): Promise<Metadata> => {
  const { t } = await createTranslation('translation')

  return {
    title: `${t('randomStreetView')} - GeoWorld`,
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <GoogleApiProvider>{children}</GoogleApiProvider>
}
