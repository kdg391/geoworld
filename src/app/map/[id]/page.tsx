'use server'

import dynamic from 'next/dynamic'

import { getMap } from '../../../actions/map.js'

import {
  OFFICIAL_MAP_COUNTRY_CODES,
  OFFICIAL_MAP_WORLD_ID,
} from '../../../constants/index.js'

import { createTranslation } from '../../../i18n/server.js'

import { createClient } from '../../../utils/supabase/server.js'

const EditButton = dynamic(() => import('./EditButton.js'))
const Header = dynamic(() => import('../../../components/Header/index.js'))
const ModalButton = dynamic(() => import('./ModalButton.js'))

const Map = async ({ params }: { params: { id: string } }) => {
  const { t } = await createTranslation('translation')

  const supabase = createClient()

  const { data: userData } = await supabase.auth.getUser()
  const { data: mapData, error: mErr } = await getMap(params.id)

  if (!mapData || mErr)
    return (
      <section>
        <h1>Map Not Found</h1>
      </section>
    )

  return (
    <>
      <Header />

      <main>
        <section>
          <h1>
            {mapData.type === 'official'
              ? mapData.id === OFFICIAL_MAP_WORLD_ID
                ? t('world')
                : t(`country.${OFFICIAL_MAP_COUNTRY_CODES[mapData.id]}`)
              : mapData.name}
          </h1>
          <p>{t(`mapType.${mapData.type}`)}</p>
          <p>
            {t('locations', {
              count: mapData.locations_count,
            })}
          </p>
          <ModalButton mapData={mapData} userId={userData.user?.id} />
          {mapData.creator === userData.user?.id && (
            <EditButton mapId={mapData.id} />
          )}
        </section>
      </main>
    </>
  )
}

export default Map
