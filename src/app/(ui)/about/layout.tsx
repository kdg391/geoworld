// import { createTranslation } from '@/i18n/server.js'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
  // const { t } = await createTranslation('common')

  return {
    title: 'Docs - GeoWorld',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
