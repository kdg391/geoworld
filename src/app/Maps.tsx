'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import {
  getRandomCommunityMaps,
  getRandomOfficialMaps,
} from '../actions/map.js'

import { useTranslation } from '../i18n/client.js'

import styles from './page.module.css'

import type { Map } from '../types/index.js'

const MapCard = dynamic(() => import('../components/MapCard/index.js'))
const SkeletonMapCard = dynamic(
  () => import('../components/MapCard/Skeleton.js'),
)

const Maps = () => {
  const { t } = useTranslation('translation')

  const [communityMaps, setCommunityMaps] = useState<Map[] | null>()
  const [officialMaps, setOfficialMaps] = useState<Map[] | null>()

  useEffect(() => {
    const init = async () => {
      const { data: oData, error: oErr } = await getRandomOfficialMaps(4)

      if (!oData || oErr) {
        setOfficialMaps(null)
        return
      }

      setOfficialMaps(oData)

      const { data: cData, error: cErr } = await getRandomCommunityMaps(4)

      if (!cData || cErr) {
        setCommunityMaps(null)
        return
      }

      setCommunityMaps(cData)
    }

    init()
  }, [])

  return (
    <>
      <div>
        <h2>{t('officialMaps')}</h2>

        {officialMaps === null ? (
          <div>{"Can't load the official maps"}</div>
        ) : (
          <>
            <div className={styles['map-cards']}>
              {!officialMaps
                ? Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonMapCard key={i} />
                  ))
                : officialMaps.map((map) => (
                    <MapCard key={map.id} mapData={map} />
                  ))}
            </div>

            {officialMaps && <Link href="/maps">View other maps</Link>}
          </>
        )}
      </div>
      <div>
        <h2>{t('communityMaps')}</h2>

        {communityMaps === null ? (
          "Can't load the community maps"
        ) : (
          <>
            <div className={styles['map-cards']}>
              {!communityMaps
                ? Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonMapCard key={i} />
                  ))
                : communityMaps.map((map) => (
                    <MapCard key={map.id} mapData={map} />
                  ))}
            </div>

            {communityMaps && <Link href="/maps">View other maps</Link>}
          </>
        )}
      </div>
    </>
  )
}

export default Maps
