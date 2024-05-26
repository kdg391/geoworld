import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { formatTimeLeft } from '../utils/index.js'

import styles from './RoundStatus.module.css'

interface Props {
    finishTimeOut: () => void
    mapName: string
    round: number
    rounds: number
    timeLimit: number | null
    totalScore: number
}

const RoundStatus: React.FC<Props> = ({
    finishTimeOut,
    mapName,
    round,
    rounds,
    timeLimit,
    totalScore,
}) => {
    const { t } = useTranslation()

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

            finishTimeOut()
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

            <div className={styles.roundStatus}>
                <div>
                    <span>{t('game.roundStatus.map')}</span>
                    <span>{mapName}</span>
                </div>
                <div>
                    <span>{t('game.roundStatus.round')}</span>
                    <span>
                        {round + 1} / {rounds}
                    </span>
                </div>
                <div>
                    <span>{t('game.roundStatus.score')}</span>
                    <span>{totalScore.toLocaleString()}</span>
                </div>
            </div>
        </div>
    )
}

export default RoundStatus
