import dynamic from 'next/dynamic'
import Link from 'next/link'

import { createTranslation } from '@/i18n/server.js'

import styles from './page.module.css'
import homeStyles from '../page.module.css'

import type { Map } from '@/types/map.js'

const MapCard = dynamic(() => import('@/components/MapCard/index.js'))

const Maps = async () => {
  const { data: officialMaps } = (await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/maps/official?page=0`,
  ).then((res) => res.json())) as { data: Map[] | null }
  const { data: communityMaps } = (await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/maps/community?page=0`,
  ).then((res) => res.json())) as { data: Map[] | null }

  const { t } = await createTranslation('common')

  return (
    <main>
      <section className={styles.section}>
        <div
          style={{
            marginBottom: '1rem',
          }}
        >
          <h2 className={styles.title}>{t('official_maps')}</h2>
          <div className={homeStyles['map-cards']}>
            {officialMaps?.map((map) => <MapCard key={map.id} mapData={map} />)}
          </div>
          <Link href="/maps/official">{t('more_official_maps')}</Link>
        </div>
        <div>
          <h2 className={styles.title}>{t('community_maps')}</h2>
          <div className={homeStyles['map-cards']}>
            {communityMaps?.map((map) => (
              <MapCard key={map.id} mapData={map} />
            ))}
          </div>
          <Link href="/maps/community">{t('more_community_maps')}</Link>
        </div>
      </section>
    </main>
  )
}

export default Maps
