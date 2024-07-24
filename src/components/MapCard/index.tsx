'use client'

import dynamic from 'next/dynamic'
// import Image from 'next/image'
import { useRouter } from 'next/navigation'

import {
  FLAG_ENOJIS,
  OFFICIAL_MAP_COUNTRY_CODES,
  OFFICIAL_MAP_WORLD_ID,
  WORLD_EMOJI,
} from '../../constants/index.js'

import { useTranslation } from '../../i18n/client.js'

import styles from './index.module.css'
import './index.css'

import type { Map } from '../../types/index.js'

const Button = dynamic(() => import('../common/Button/index.js'))
const Twemoji = dynamic(() => import('../Twemoji.js'))

interface Props {
  mapData: Map
}

const MapCard = ({ mapData }: Props) => {
  const router = useRouter()
  const { t } = useTranslation('translation')

  return (
    <div className={styles['map-card']}>
      <div className={styles['map-thumbnail']}>
        {/* <Image
          src={`/assets/images/${mapData.code}.avif`}
          alt={`${
            mapData.code === 'worldwide' ? 'Worldwide' : mapData.code
          } Image`}
          fill
          sizes="100%"
          className={styles['map-thumbnail-img']}
        /> */}
        <div className={styles['map-thumbnail-backdrop']}></div>
        <div className={styles['map-name-wrapper']}>
          {mapData.type === 'official' && (
            <Twemoji
              emoji={
                mapData.id === OFFICIAL_MAP_WORLD_ID
                  ? WORLD_EMOJI
                  : FLAG_ENOJIS[OFFICIAL_MAP_COUNTRY_CODES[mapData.id]]
              }
              width={28}
              height={28}
              alt={
                mapData.id === OFFICIAL_MAP_WORLD_ID
                  ? t('world')
                  : t(`country.${OFFICIAL_MAP_COUNTRY_CODES[mapData.id]}`)
              }
            />
          )}
          <span>
            {mapData.type === 'official'
              ? mapData.id === OFFICIAL_MAP_WORLD_ID
                ? t('world')
                : t(`country.${OFFICIAL_MAP_COUNTRY_CODES[mapData.id]}`)
              : mapData.name}
          </span>
        </div>
      </div>
      <div className={styles['card-content']}>
        <span>
          {t('mapCard.locations', { count: mapData.locations_count })}
        </span>
        <Button
          variant="primary"
          size="m"
          aria-label={t('mapCard.play')}
          disabled={mapData.locations_count === 0}
          onClick={() => router.push(`/map/${mapData.id}`)}
        >
          {t('mapCard.play')}
        </Button>
      </div>
    </div>
  )
}

export default MapCard
