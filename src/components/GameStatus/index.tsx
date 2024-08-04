'use client'

import { useEffect, useRef, useState } from 'react'

import { useTranslation } from '../../i18n/client.js'

import { formatTimeLeft } from '../../utils/index.js'

import styles from './index.module.css'
import './index.css'

interface Props {
  finishRound: (timedOut: boolean) => Promise<void>
  mapName: string
  round: number
  rounds: number
  timeLimit: number | null
  totalScore: number
}

const GameStatus = ({
  finishRound,
  mapName,
  round,
  rounds,
  timeLimit,
  totalScore,
}: Props) => {
  const { t } = useTranslation('game')

  const [timeLeft, setTimeLeft] = useState<number | null>(timeLimit)

  const pathRef = useRef<SVGCircleElement | null>(null)

  useEffect(() => {
    if (timeLimit === null || timeLeft === null) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev as number) - 1)
    }, 1000)

    if (pathRef.current) {
      const circumference = 2 * Math.PI * 24

      pathRef.current.style.strokeDasharray = String(circumference)
      pathRef.current.style.strokeDashoffset = String(
        circumference * (1 - timeLeft / timeLimit),
      )
    }

    if (timeLeft <= 0) {
      clearInterval(interval)

      finishRound(true)
    }

    return () => clearInterval(interval)
  }, [timeLimit, timeLeft])

  return (
    <div className={styles['game-status-container']}>
      {timeLimit !== null && timeLeft !== null && (
        <div className={styles['timer-container']}>
          <div className={styles['timer-text']}>{formatTimeLeft(timeLeft)}</div>
          <svg width="100%" height="100%" className={styles['timer-svg']}>
            <circle
              cx="24"
              cy="24"
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
          <span className={styles['game-status-label']}>{t('status.map')}</span>
          <span>{mapName}</span>
        </div>
        <div>
          <span className={styles['game-status-label']}>
            {t('status.round')}
          </span>
          <span>
            {round + 1} / {rounds}
          </span>
        </div>
        <div>
          <span className={styles['game-status-label']}>
            {t('status.score')}
          </span>
          <span>{totalScore.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

export default GameStatus
