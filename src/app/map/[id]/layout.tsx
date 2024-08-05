import type { Metadata } from 'next'

import { getMap } from '../../../actions/map.js'

import {
  OFFICIAL_MAP_COUNTRY_CODES,
  OFFICIAL_MAP_WORLD_ID,
} from '../../../constants/index.js'

import { createTranslation } from '../../../i18n/server.js'

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

  const mapName =
    mapData.type === 'official'
      ? mapData.id === OFFICIAL_MAP_WORLD_ID
        ? t('world')
        : t(`country.${OFFICIAL_MAP_COUNTRY_CODES[mapData.id]}`)
      : mapData.name

  return {
    title: `${mapName} - ${t('map')} - GeoWorld`,
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
