import React, { useEffect, useState } from 'react'

import { MAX_ROUNDS } from '../utils/constants/index.js'
import { formatTimeLeft } from '../utils/index.js'

import styles from './RoundStatus.module.css'

interface Props {
    finishTimeUp: () => void
    mapName: string
    round: number
    timeLimit: number | null
    totalScore: number
}

const RoundStatus: React.FC<Props> = ({
    finishTimeUp,
    mapName,
    round,
    timeLimit,
    totalScore,
}) => {
    const [timeLeft, setTimeLeft] = useState<number | null>(null)

    useEffect(() => {
        setTimeLeft(timeLimit)
    }, [])

    useEffect(() => {
        if (timeLimit !== null) {
            setTimeLeft(timeLimit)
        }
    }, [round])

    useEffect(() => {
        if (timeLeft === null) return

        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev as number) - 1)
        }, 1000)

        if (timeLeft <= 0) {
            clearInterval(interval)

            finishTimeUp()
        }

        return () => {
            clearInterval(interval)
        }
    }, [timeLeft])

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
