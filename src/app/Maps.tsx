'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import {
  getRandomCommunityMaps,
  getRandomOfficialMaps,
} from '../actions/map.js'

import { useTranslation } from '../i18n/client.js'

import styles from './page.module.css'

import type { Map } from '../types/index.js'

import MapCard from '../components/MapCard/index.js'
import SkeletonMapCard from '../components/MapCard/Skeleton.js'

const Maps = () => {
  const [communityMaps, setCommunityMaps] = useState<Map[] | null>()
  const [officialMaps, setOfficialMaps] = useState<Map[] | null>()

  const { t } = useTranslation('translation')

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
              {officialMaps
                ? officialMaps.map((map) => (
                    <MapCard key={map.id} mapData={map} />
                  ))
                : Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonMapCard key={i} />
                  ))}
            </div>

            {officialMaps && (
              <Link href="/maps/official">{t('moreOfficialMaps')}</Link>
            )}
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
              {communityMaps
                ? communityMaps.map((map) => (
                    <MapCard key={map.id} mapData={map} />
                  ))
                : Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonMapCard key={i} />
                  ))}
            </div>

            {communityMaps && (
              <Link href="/maps/community">{t('moreCommunityMaps')}</Link>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default Maps
