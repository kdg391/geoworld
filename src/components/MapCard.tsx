import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'

import { FLAG_ENOJIS } from '../constants/index.js'

import styles from './MapCard.module.css'

import type { MapData } from '../types/index.js'

const Button = lazy(() => import('./common/Button.js'))
const Twemoji = lazy(() => import('./Twemoji.js'))

interface GameCardProps {
    mapData: MapData
    onPlayBtnClick: React.MouseEventHandler<HTMLButtonElement>
}

const MapCard: React.FC<GameCardProps> = ({ mapData, onPlayBtnClick }) => {
    const { t } = useTranslation()

    return (
        <div className={styles['map-card']}>
            <div className={styles['map-thumbnail']}>
                <img
                    src={`/geoworld/assets/images/${mapData.code}.avif`}
                    alt={`${
                        mapData.code === 'worldwide'
                            ? t('worldwide')
                            : t(`countries.${mapData.code}`)
                    } Image`}
                    className={styles['map-thumbnail-img']}
                />
                <div className={styles['map-thumbnail-backdrop']}></div>
                <div className={styles['map-name-wrapper']}>
                    <Suspense>
                        <Twemoji
                            emoji={
                                mapData.code === 'worldwide'
                                    ? '🌐'
                                    : FLAG_ENOJIS[mapData.code]
                            }
                            width={28}
                            height={28}
                            alt={
                                mapData.code === 'worldwide'
                                    ? t('worldwide')
                                    : t(`countries.${mapData.code}`)
                            }
                        />
                    </Suspense>
                    {mapData.code === 'worldwide'
                        ? t('worldwide')
                        : t(`countries.${mapData.code}`)}
                </div>
            </div>
            <div className={styles['card-content']}>
                <span>
                    {t('home.locations', {
                        count: mapData.locations.length,
                    })}
                </span>
                <Suspense>
                    <Button
                        variant="primary"
                        size="m"
                        aria-label={t('home.play')}
                        disabled={mapData.locations.length === 0}
                        onClick={onPlayBtnClick}
                    >
                        {t('home.play')}
                    </Button>
                </Suspense>
            </div>
        </div>
    )
}

export default MapCard
