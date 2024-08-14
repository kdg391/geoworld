'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Trans } from 'react-i18next'

import { getGame } from '@/actions/game.js'

import useSettings from '@/hooks/useSettings.js'

import { useTranslation } from '@/i18n/client.js'

import styles from './index.module.css'
import './index.css'

import type { Game, GameView, GuessedRound } from '@/types/index.js'

const Button = dynamic(() => import('../common/Button/index.js'))

interface Props {
  finished: boolean
  gameId: string
  guessedRound: GuessedRound
  round: number
  rounds: number
  setGameData: React.Dispatch<React.SetStateAction<Game | null | undefined>>
  setView: React.Dispatch<React.SetStateAction<GameView | null>>
}

const RoundResult = ({
  finished,
  gameId,
  guessedRound,
  round,
  rounds,
  setGameData,
  setView,
}: Props) => {
  const { distanceUnit } = useSettings()

  const [isLoading, setIsLoading] = useState(false)

  const { t } = useTranslation('game')

  const onNextClick = async () => {
    setIsLoading(true)

    const { data: gData, error: gErr } = await getGame(gameId)

    setIsLoading(false)

    if (!gData || gErr) return

    setGameData(gData)

    if (round === rounds - 1 && gData.state === 'finished') {
      setView('finalResult')
    } else {
      setView('game')
    }
  }

  return (
    <>
      <h2>
        {t('roundResult.points', {
          count: guessedRound.points,
        })}
      </h2>
      <p>
        {guessedRound.timedOut ? (
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
        className={styles['next-btn']}
        disabled={isLoading}
        aria-disabled={isLoading}
        onClick={onNextClick}
      >
        {round === rounds - 1 && finished
          ? t('roundResult.viewResults')
          : t('roundResult.nextRound')}
      </Button>
    </>
  )
}

export default RoundResult
