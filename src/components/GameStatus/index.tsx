'use client'

import { memo, useEffect, useRef, useState } from 'react'

import { useTranslation } from '@/i18n/client.js'

import { formatTimeLeft } from '@/utils/index.js'

import styles from './index.module.css'

import './index.css'

import type { RoundLocation } from '@/types/location.js'

interface Props {
  finishRound: (timedOut: boolean) => Promise<void>
  location: RoundLocation
  mapName: string
  round: number
  rounds: number
  timeLimit: number
  totalScore: number
}

const GameStatus = ({
  finishRound,
  location,
  mapName,
  round,
  rounds,
  timeLimit,
  totalScore,
}: Props) => {
  const timerRef = useRef<number | null>(null)
  const pathRef = useRef<SVGCircleElement | null>(null)

  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const currentTime = new Date().getTime()
    const timeElapsed = Math.floor(
      (currentTime - location.startedAt.getTime()) / 1000,
    )
    const left = timeLimit - timeElapsed

    return left
  })

  const { t } = useTranslation('game')

  useEffect(() => {
    if (timeLimit === 0) return

    const interval = window.setTimeout(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    timerRef.current = interval

    if (pathRef.current) {
      const circumference = 2 * Math.PI * 24

      pathRef.current.style.strokeDasharray = String(circumference)
      pathRef.current.style.strokeDashoffset = String(
        circumference * (1 - timeLeft / timeLimit),
      )
    }

    if (timeLeft <= 0) {
      clearTimeout(interval)

      finishRound(true)
    }

    return () => clearTimeout(interval)
  }, [timeLimit, timeLeft])

  useEffect(() => {
    const onChange = () => {
      if (!timerRef.current) return

      if (document.hidden) {
        clearTimeout(timerRef.current)
      } else {
        const currentTime = new Date().getTime()
        const timeElapsed = Math.floor(
          (currentTime - location.startedAt.getTime()) / 1000,
        )
        const left = timeLimit - timeElapsed

        setTimeLeft(left)
      }
    }

    document.addEventListener('visibilitychange', onChange)

    return () => {
      document.removeEventListener('visibilitychange', onChange)
    }
  }, [])

  return (
    <div className={styles['game-status-container']}>
      {timeLimit !== 0 && timeLeft !== 0 && (
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

export default memo(GameStatus)
