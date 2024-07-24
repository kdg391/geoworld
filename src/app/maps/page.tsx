import dynamic from 'next/dynamic'

import { getOfficialMaps } from '../../actions/map.js'

import styles from './page.module.css'
import { createClient } from '../../utils/supabase/server.js'

const Header = dynamic(() => import('../../components/Header/index.js'))
const MapCard = dynamic(() => import('../../components/MapCard/index.js'))
const ModalButton = dynamic(() => import('./ModalButton.js'))

const Maps = async () => {
  const { data: officialMaps, error: oErr } = await getOfficialMaps()

  if (!officialMaps || oErr) return

  const supabase = createClient()

  const { data: uData, error: uErr } = await supabase.auth.getUser()

  return (
    <>
      <Header />

      <main style={{ height: 'calc(100% - var(--header-h))' }}>
        <section>
          <div>
            {(uData.user || !uErr) && (
              <ModalButton userId={uData.user?.id as string} />
            )}
          </div>
          <div className={styles.maps}>
            {officialMaps.map((map) => (
              <MapCard key={map.id} mapData={map} />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

export default Maps
