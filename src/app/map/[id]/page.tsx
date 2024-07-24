'use server'

import dynamic from 'next/dynamic'

import { getMap } from '../../../actions/map.js'

import { createClient } from '../../../utils/supabase/server.js'
import { createTranslation } from '../../../i18n/server.js'

const EditButton = dynamic(() => import('./EditButton.js'))
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
    <section>
      <h1>{mapData.name}</h1>
      <p>{t(`mapTypes.${mapData.type}`)}</p>
      <p>{mapData.locations_count} Locations</p>
      <ModalButton mapData={mapData} userId={userData.user?.id} />
      {mapData.creator === userData.user?.id && (
        <EditButton mapId={mapData.id} />
      )}
    </section>
  )
}

export default Map
