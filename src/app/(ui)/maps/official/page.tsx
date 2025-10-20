'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import MapCard from '@/components/MapCard/index.tsx'
import SkeletonMapCard from '@/components/MapCard/skeleton.tsx'
import { MAPS_PAGE_LIMIT } from '@/constants/map.ts'
import { useTranslation } from '@/i18n/client.ts'

import homeStyles from '../../page.module.css'

import styles from '../community/page.module.css'

import type { Map } from '@/types/map.ts'

const Button = dynamic(() => import('@/components/common/Button/index.tsx'))

const Official = () => {
  const { t } = useTranslation('common')

  const [page, setPage] = useState(0)

  const [maps, setMaps] = useState<Map[]>([])

  const [hasMore, setHasMore] = useState(false)

  const loadMaps = async () => {
    try {
      const res = await fetch(`/api/maps/official?page=${page}`, {
        method: 'GET',
        next: {
          revalidate: 60,
        },
      })

      if (!res.ok) return

      const { data } = await res.json()

      setMaps((m) => [...m, ...data])
      setHasMore(data.length >= MAPS_PAGE_LIMIT)
    } catch {}
  }

  useEffect(() => {
    loadMaps()
  }, [page])

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>{t('official_maps')}</h1>
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

export default Official
