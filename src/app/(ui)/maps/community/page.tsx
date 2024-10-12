'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { PAGE_PER_MAPS } from '@/constants/index.js'

import { useTranslation } from '@/i18n/client.js'

import type { Map } from '@/types/index.js'

import styles from './page.module.css'
import homeStyles from '../../page.module.css'

import MapCard from '@/components/MapCard/index.js'
import SkeletonMapCard from '@/components/MapCard/Skeleton.js'

const Button = dynamic(() => import('@/components/common/Button/index.js'))

const Community = () => {
  const { t } = useTranslation('common')

  const [page, setPage] = useState(0)

  const [maps, setMaps] = useState<Map[]>([])

  const [hasMore, setHasMore] = useState(false)

  const loadMaps = async () => {
    try {
      const res = await fetch(`/api/maps/community?page=${page}`, {
        method: 'GET',
        next: {
          revalidate: 60,
        },
      })

      if (!res.ok) return

      const { data } = await res.json()

      setMaps((m) => [...m, ...data])
      setHasMore(data.length >= PAGE_PER_MAPS)
    } catch {}
  }

  useEffect(() => {
    loadMaps()
  }, [page])

  return (
    <section className={styles.section}>
      <h1>{t('community_maps')}</h1>
      <div className={homeStyles['map-cards']}>
        {maps.length > 0
          ? maps.map((m) => <MapCard key={m.id} mapData={m} />)
          : Array.from({ length: 16 }).map((_, i) => (
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
            {t('load_more')}
          </Button>
        </div>
      )}
    </section>
  )
}

export default Community
