import { createTranslation } from '@/i18n/server.js'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
  const { t } = await createTranslation('translation')

  return {
    title: `${t('maps')} - GeoWorld`,
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
