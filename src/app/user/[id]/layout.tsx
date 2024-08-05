import dynamic from 'next/dynamic'

import { getProfile } from '../../../actions/profile.js'

import { createTranslation } from '../../../i18n/server.js'

import type { Metadata } from 'next'

const Header = dynamic(() => import('../../../components/Header/index.js'))

interface Props {
  params: {
    id: string
  }
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  if (decodeURIComponent(params.id).startsWith('@')) return {}

  const { t } = await createTranslation('translation')

  const { data: pData, error: pErr } = await getProfile(params.id)

  if (!pData || pErr)
    return {
      title: `${t('user')} - GeoWorld`,
    }

  return {
    title: `${pData.display_name} - ${t('user')} - GeoWorld`,
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
