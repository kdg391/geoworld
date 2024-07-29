import dynamic from 'next/dynamic'

import { getCommunityMaps, getOfficialMaps } from '../../actions/map.js'

import { createTranslation } from '../../i18n/server.js'

import { createClient } from '../../utils/supabase/server.js'

import styles from './page.module.css'
import homeStyles from '../page.module.css'

const Header = dynamic(() => import('../../components/Header/index.js'))
const MapCard = dynamic(() => import('../../components/MapCard/index.js'))
const ModalButton = dynamic(() => import('./ModalButton.js'))

const Maps = async () => {
  const { data: officialMaps, error: oErr } = await getOfficialMaps(0)

  if (!officialMaps || oErr) return

  const { data: communityMaps, error: cErr } = await getCommunityMaps(0)

  if (!communityMaps || cErr) return

  const supabase = createClient()

  const { data: uData, error: uErr } = await supabase.auth.getUser()

  const { t } = await createTranslation('translation')

  return (
    <>
      <Header />

      <main className={styles.main}>
        <section className={styles.section}>
          <div>
            {(uData.user || !uErr) && (
              <ModalButton userId={uData.user?.id as string} />
            )}
          </div>
          <div>
            <h2>{t('officialMaps')}</h2>
            <div className={homeStyles['map-cards']}>
              {officialMaps.map((map) => (
                <MapCard key={map.id} mapData={map} />
              ))}
            </div>
          </div>
          <div>
            <h2>{t('communityMaps')}</h2>
            <div className={homeStyles['map-cards']}>
              {communityMaps.map((map) => (
                <MapCard key={map.id} mapData={map} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Maps
