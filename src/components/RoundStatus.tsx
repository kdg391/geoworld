import React from 'react'

import { MAX_ROUNDS } from '../utils/constants/index.js'
import { formatTimeLeft } from '../utils/index.js'

import styles from './RoundStatus.module.css'

interface Props {
    timeLimit: number | null
    timeLeft: number | null
    mapName: string
    round: number
    totalScore: number
}

const RoundStatus: React.FC<Props> = ({
    mapName,
    round,
    timeLeft,
    timeLimit,
    totalScore,
}) => {
    return (
        <div className={styles.roundStatusContainer}>
            {timeLimit !== null && timeLeft !== null && (
                <div className={styles.timeLeft}>
                    {formatTimeLeft(timeLeft)}
                </div>
            )}

            <div className={styles.roundInfo}>
                <div>
                    <span>Map</span>
                    <span>{mapName}</span>
                </div>
                <div>
                    <span>Round</span>
                    <span>
                        {round + 1} / {MAX_ROUNDS}
                    </span>
                </div>
                <div>
                    <span>Score</span>
                    <span>{totalScore.toLocaleString()}</span>
                </div>
            </div>
        </div>
    )
}

export default RoundStatus
