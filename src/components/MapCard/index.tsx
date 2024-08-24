'use client'

// import Image from 'next/image'
import { useRouter } from 'next/navigation'

import {
  FLAG_ENOJIS,
  OFFICIAL_MAP_COUNTRY_CODES,
  OFFICIAL_MAP_WORLD_ID,
  WORLD_EMOJI,
} from '@/constants/index.js'

import { useTranslation } from '@/i18n/client.js'

import styles from './index.module.css'
import './index.css'

import type { Map } from '@/types/index.js'

import Button from '../common/Button/index.js'
import Twemoji from '../Twemoji.js'

interface Props {
  mapData: Map
}

const MapCard = ({ mapData }: Props) => {
  const router = useRouter()

  const { t } = useTranslation('translation')

  return (
    <div className={styles['map-card']}>
      <div className={styles['map-thumbnail']}>
        {/*<Image
          src={`/assets/images/${mapData.id}.avif`}
          alt="thumbnail"
          fill
          sizes="100%"
          className={styles['map-thumbnail-img']}
        />*/}
        <div className={styles['map-thumbnail-backdrop']}></div>
        <div className={styles['map-name-wrapper']}>
          {mapData.type === 'official' && (
            <Twemoji
              emoji={
                mapData.id === OFFICIAL_MAP_WORLD_ID
                  ? WORLD_EMOJI
                  : FLAG_ENOJIS[OFFICIAL_MAP_COUNTRY_CODES[mapData.id]]
              }
              width={24}
              height={24}
              alt={mapData.name}
            />
          )}
          <span>{mapData.name}</span>
        </div>
      </div>
      <div className={styles['map-actions']}>
        <Button
          variant="primary"
          size="m"
          disabled={mapData.locations_count === 0}
          onClick={() => router.push(`/map/${mapData.id}`)}
        >
          {t('play')}
        </Button>
      </div>
    </div>
  )
}

export default MapCard
