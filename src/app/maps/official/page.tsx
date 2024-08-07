'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { getOfficialMaps } from '../../../actions/map.js'

import { useTranslation } from '../../../i18n/client.js'

import type { Map } from '../../../types/index.js'

import styles from '../community/page.module.css'
import homeStyles from '../../page.module.css'

import MapCard from '../../../components/MapCard/index.js'
import SkeletonMapCard from '../../../components/MapCard/Skeleton.js'

const Button = dynamic(
  () => import('../../../components/common/Button/index.js'),
)

const Official = () => {
  const { t } = useTranslation('translation')

  const [page, setPage] = useState(0)

  const [maps, setMaps] = useState<Map[]>([])

  const [hasMore, setHasMore] = useState(false)

  const loadMaps = async () => {
    const { data, hasMore, error } = await getOfficialMaps(page)

    if (!data || error) return

    setMaps((m) => [...m, ...data])
    setHasMore(hasMore)
  }

  useEffect(() => {
    loadMaps()
  }, [page])

  return (
    <section className={styles.section}>
      <h1>{t('officialMaps')}</h1>
      <div className={homeStyles['map-cards']}>
        {maps.length > 0
          ? maps.map((m) => <MapCard key={m.id} mapData={m} />)
          : Array.from({ length: 12 }).map((_, i) => (
              <SkeletonMapCard key={i} />
            ))}
      </div>
      {hasMore && (
        <div className={styles['btn-wrapper']}>
          <Button
            variant="primary"
            size="s"
            onClick={() => setPage((p) => p + 1)}
          >
            Load more
          </Button>
        </div>
      )}
    </section>
  )
}

export default Official
