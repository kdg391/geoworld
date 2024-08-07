import { getMap } from '../../../actions/map.js'

import { createTranslation } from '../../../i18n/server.js'

import type { Metadata } from 'next'

interface Props {
  params: {
    id: string
  }
}

export const revalidate = 60

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { t } = await createTranslation('translation')

  const { data: mapData, error: err } = await getMap(params.id)

  if (!mapData || err)
    return {
      title: `${t('map')} - GeoWorld`,
    }

  return {
    title: `${mapData.name} - ${t('map')} - GeoWorld`,
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
