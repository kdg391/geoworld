import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { formatTimeLeft } from '../utils/index.js'

import styles from './GameStatus.module.css'

interface Props {
    finishRound: (timedOut: boolean) => void
    mapName: string
    round: number
    rounds: number
    timeLimit: number | null
    totalScore: number
}

const GameStatus: React.FC<Props> = ({
    finishRound,
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

            finishRound(true)
        }

        return () => {
            clearInterval(interval)
        }
    }, [timeLeft])

    return (
        <div className={styles['game-status-container']}>
            {timeLimit !== null && timeLeft !== null && (
                <div className={styles['timer-container']}>
                    {formatTimeLeft(timeLeft)}
                </div>
            )}

            <div className={styles['game-status']}>
                <div>
                    <span className="label">{t('game.gameStatus.map')}</span>
                    <span>{mapName}</span>
                </div>
                <div>
                    <span className="label">
                        {t('game.gameStatus.rounds', {
                            count: rounds,
                        })}
                    </span>
                    <span>
                        {round + 1} / {rounds}
                    </span>
                </div>
                <div>
                    <span className="label">{t('game.gameStatus.score')}</span>
                    <span>{totalScore.toLocaleString()}</span>
                </div>
            </div>
        </div>
    )
}

export default GameStatus
