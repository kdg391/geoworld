import dynamic from 'next/dynamic'
import Link from 'next/link'

import { getCommunityMaps, getOfficialMaps } from '../../actions/map.js'

import { createTranslation } from '../../i18n/server.js'

import styles from './page.module.css'
import homeStyles from '../page.module.css'

const MapCard = dynamic(() => import('../../components/MapCard/index.js'))

const Maps = async () => {
  const { data: officialMaps, error: oErr } = await getOfficialMaps(0)

  if (!officialMaps || oErr) return

  const { data: communityMaps, error: cErr } = await getCommunityMaps(0)

  if (!communityMaps || cErr) return

  const { t } = await createTranslation('translation')

  return (
    <section className={styles.section}>
      <div>
        <h2>{t('officialMaps')}</h2>
        <div className={homeStyles['map-cards']}>
          {officialMaps.map((map) => (
            <MapCard key={map.id} mapData={map} />
          ))}
        </div>
        <Link href="/maps/official">More official maps</Link>
      </div>
      <div>
        <h2>{t('communityMaps')}</h2>
        <div className={homeStyles['map-cards']}>
          {communityMaps.map((map) => (
            <MapCard key={map.id} mapData={map} />
          ))}
        </div>
        <Link href="/maps/community">More community maps</Link>
      </div>
    </section>
  )
}

export default Maps
