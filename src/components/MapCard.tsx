import React, { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

import { FLAG_ENOJIS, type GameData } from '../utils/constants/index.js'

import styles from './MapCard.module.css'
import homeStyles from '../routes/Home.module.css'

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
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75)), url('/geography-guessing/assets/images/${gameData.code}.avif')`,
                }}
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
                    <span className={styles.mapName}>
                        {gameData.code === 'worldwide'
                            ? t('worldwide')
                            : t(`countries.${gameData.code}`)}
                    </span>
                </div>
            </div>
            <div className={styles.cardContent}>
                <span>
                    {t('home.locations', {
                        locations: gameData.locations.length,
                    })}
                </span>
                <button
                    className={homeStyles.playBtn}
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
