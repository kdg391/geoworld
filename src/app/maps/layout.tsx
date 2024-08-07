import dynamic from 'next/dynamic'

import { createTranslation } from '../../i18n/server.js'

import type { Metadata } from 'next'

const Header = dynamic(() => import('../../components/Header/index.js'))

export const generateMetadata = async (): Promise<Metadata> => {
  const { t } = await createTranslation('translation')

  return {
    title: `${t('maps')} - GeoWorld`,
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      <main>{children}</main>
    </>
  )
}
