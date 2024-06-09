import React, { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

import { FLAG_ENOJIS } from '../constants/index.js'

import styles from './MapCard.module.css'

import type { GameData } from '../types/index.js'

const Twemoji = lazy(() => import('./Twemoji.js'))

interface GameCardProps {
    gameData: GameData
    onPlayBtnClick: React.MouseEventHandler<HTMLButtonElement>
}

const MapCard: React.FC<GameCardProps> = ({ gameData, onPlayBtnClick }) => {
    const { t } = useTranslation()

    return (
        <div className={styles.mapCard}>
            <div
                className={styles.mapThumbnail}
                style={
                    {
                        '--image-url': `url('/geoworld/assets/images/${gameData.code}.avif')`,
                    } as React.CSSProperties
                }
            >
                <div className={styles.mapNameWrapper}>
                    <Suspense>
                        <Twemoji
                            emoji={
                                gameData.code === 'worldwide'
                                    ? '🌐'
                                    : FLAG_ENOJIS[gameData.code]
                            }
                            width={28}
                            height={28}
                            alt={
                                gameData.code === 'worldwide'
                                    ? t('worldwide')
                                    : t(`countries.${gameData.code}`)
                            }
                        />
                    </Suspense>
                    {gameData.code === 'worldwide'
                        ? t('worldwide')
                        : t(`countries.${gameData.code}`)}
                </div>
            </div>
            <div className={styles.cardContent}>
                <span>
                    {t('home.locations', {
                        count: gameData.locations.length,
                    })}
                </span>
                <button
                    className={styles.playBtn}
                    aria-label={t('home.play')}
                    disabled={gameData.locations.length === 0}
                    onClick={onPlayBtnClick}
                >
                    {t('home.play')}
                </button>
            </div>
        </div>
    )
}

export default MapCard
