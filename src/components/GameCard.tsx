import React from 'react'

import Twemoji from '../components/Twemoji.js'

import { MAX_ROUNDS, type GameData } from '../utils/constants/index.js'

import styles from './GameCard.module.css'
import homeStyles from '../routes/Home.module.css'

interface GameCardProps {
    gameData: GameData
    onPlayBtnClick: React.MouseEventHandler<HTMLButtonElement>
}

const GameCard: React.FC<GameCardProps> = ({ gameData, onPlayBtnClick }) => (
    <div className={styles.mapItem}>
        <Twemoji
            emoji={gameData.emoji}
            width={36}
            height={36}
            alt={gameData.country}
        />
        <div className={styles.countryName}>{gameData.country}</div>
        <button
            className={homeStyles.playBtn}
            disabled={gameData.locations.length < MAX_ROUNDS}
            onClick={onPlayBtnClick}
        >
            Play
        </button>
    </div>
)

export default GameCard
