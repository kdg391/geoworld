import React from 'react'

import Twemoji from '../components/Twemoji.js'

import type { GameData } from '../utils/constants.js'

import styles from './GameCard.module.css'
import homeStyles from '../routes/Home.module.css'

interface GameCardProps {
    gameData: GameData
    onPlayBtnClick: React.MouseEventHandler<HTMLButtonElement>
}

const GameCard: React.FC<GameCardProps> = ({ gameData, onPlayBtnClick }) => (
    <div className={styles.mapItem}>
        <Twemoji emoji={gameData.emoji} />
        <div className={styles.countryName}>{gameData.country}</div>
        <button
            className={homeStyles.playBtn}
            disabled={gameData.locations.length < 5}
            onClick={onPlayBtnClick}
        >
            Play
        </button>
    </div>
)

export default GameCard
