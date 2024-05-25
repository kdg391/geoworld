import React, { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

import {
    FLAG_ENOJIS,
    MAX_ROUNDS,
    type GameData,
} from '../utils/constants/index.js'

import styles from './GameCard.module.css'
import homeStyles from '../routes/Home.module.css'

const Twemoji = lazy(() => import('./Twemoji.js'))

interface GameCardProps {
    gameData: GameData
    onPlayBtnClick: React.MouseEventHandler<HTMLButtonElement>
}

const GameCard: React.FC<GameCardProps> = ({ gameData, onPlayBtnClick }) => {
    const { t } = useTranslation()

    return (
        <div className={styles.mapItem}>
            <Suspense>
                <Twemoji
                    emoji={
                        gameData.code === 'world'
                            ? '🌐'
                            : FLAG_ENOJIS[gameData.code]
                    }
                    width={36}
                    height={36}
                    alt={
                        gameData.code === 'world'
                            ? t('worldMap')
                            : t(`countries.${gameData.code}`)
                    }
                />
            </Suspense>
            <div className={styles.countryName}>
                {gameData.code === 'world'
                    ? t('worldMap')
                    : t(`countries.${gameData.code}`)}
            </div>
            <button
                className={homeStyles.playBtn}
                disabled={gameData.locations.length < MAX_ROUNDS}
                onClick={onPlayBtnClick}
            >
                {t('home.play')}
            </button>
        </div>
    )
}

export default GameCard
