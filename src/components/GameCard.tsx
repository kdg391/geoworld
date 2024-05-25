import React from 'react'
import { useTranslation } from 'react-i18next'

import Twemoji from '../components/Twemoji.js'

import {
    FLAG_ENOJIS,
    MAX_ROUNDS,
    type GameData,
} from '../utils/constants/index.js'

import styles from './GameCard.module.css'
import homeStyles from '../routes/Home.module.css'

interface GameCardProps {
    gameData: GameData
    onPlayBtnClick: React.MouseEventHandler<HTMLButtonElement>
}

const GameCard: React.FC<GameCardProps> = ({ gameData, onPlayBtnClick }) => {
    const { t } = useTranslation()

    return (
        <div className={styles.mapItem}>
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
