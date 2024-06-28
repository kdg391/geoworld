import { useEffect, useRef, useState } from 'react'
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

    const pathRef = useRef<SVGCircleElement | null>(null)

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

        if (pathRef.current) {
            const circumference = 2 * Math.PI * 24

            pathRef.current.style.strokeDasharray = String(circumference)
            pathRef.current.style.strokeDashoffset = String(
                circumference * (1 - timeLeft / (timeLimit as number)),
            )
        }

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
                    <div className={styles['timer-text']}>
                        {formatTimeLeft(timeLeft)}
                    </div>
                    <svg
                        width="100%"
                        height="100%"
                        className={styles['timer-svg']}
                    >
                        <circle
                            cx="25"
                            cy="25"
                            r="24"
                            width="100%"
                            height="100%"
                            ref={pathRef}
                        />
                    </svg>
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
