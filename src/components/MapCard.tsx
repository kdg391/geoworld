import { lazy, Suspense } from 'react'
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
        <div className={styles.mapCard}>
            <div
                className={styles.mapThumbnail}
                style={
                    {
                        '--image-url': `url('/geoworld/assets/images/${mapData.code}.avif')`,
                    } as React.CSSProperties
                }
            >
                <div className={styles.mapNameWrapper}>
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
            <div className={styles.cardContent}>
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
