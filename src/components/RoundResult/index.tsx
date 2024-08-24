'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Trans } from 'react-i18next'

import { updateGame } from '@/actions/game.js'

import useSettings from '@/hooks/useSettings.js'

import { useTranslation } from '@/i18n/client.js'

import styles from './index.module.css'
import './index.css'

import type { Game, GameView, Guess } from '@/types/index.js'

const Button = dynamic(() => import('../common/Button/index.js'))

interface Props {
  gameId: string
  guessedRound: Guess
  isFinished: boolean
  setGameData: React.Dispatch<React.SetStateAction<Game | null | undefined>>
  setView: React.Dispatch<React.SetStateAction<GameView | null>>
}

const RoundResult = ({
  gameId,
  guessedRound,
  isFinished,
  setGameData,
  setView,
}: Props) => {
  const { distanceUnit } = useSettings()

  const [isLoading, setIsLoading] = useState(false)

  const { t } = useTranslation('game')

  const onNextClick = async () => {
    if (isFinished) {
      setView('finalResult')
    } else {
      setIsLoading(true)

      const { data: gData, error: gErr } = await updateGame(gameId, {
        data: null,
        type: 'roundStart',
      })

      setIsLoading(false)

      if (!gData || gErr) return

      setGameData(gData)
      setView('game')
    }
  }

  return (
    <>
      <h2>
        {t('roundResult.points', {
          count: guessedRound.score,
        })}
      </h2>
      <p>
        {guessedRound.timedOut && !guessedRound.timedOutWithGuess ? (
          t('roundResult.timedOut')
        ) : (
          <Trans
            i18nKey={`roundResult.distance.${distanceUnit ?? 'metric'}`}
            t={t}
            values={{
              distance: guessedRound.distance[distanceUnit ?? 'metric'],
            }}
          />
        )}
      </p>
      <Button
        variant="primary"
        size="l"
        isLoading={isLoading}
        disabled={isLoading}
        className={styles['next-btn']}
        onClick={onNextClick}
      >
        {isFinished ? t('roundResult.viewResults') : t('roundResult.nextRound')}
      </Button>
    </>
  )
}

export default RoundResult
