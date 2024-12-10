'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { memo, useState } from 'react'

import { createGame } from '@/actions/game.js'

import { useTranslation } from '@/i18n/client.js'

import styles from '../RoundResult/index.module.css'

import type { GameSettings } from '@/types/game.js'

const Button = dynamic(() => import('../common/Button/index.js'))

interface Props {
  mapId: string
  settings: GameSettings
  totalScore: number
}

const FinalRoundResult = ({ mapId, settings, totalScore }: Props) => {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const { t } = useTranslation('game')

  const onReplayClick = async () => {
    setIsLoading(true)

    const { data: gameData, errors } = await createGame({
      mapId,
      settings,
    })

    if (!gameData || errors) {
      setIsLoading(false)
      return
    }

    router.push(`/game/${gameData.id}`)
  }

  return (
    <>
      <h2>
        {t('final_round_result.points', {
          count: totalScore,
        })}
      </h2>
      <div className={styles['result-actions']}>
        <Button
          variant="primary"
          size="l"
          isLoading={isLoading}
          disabled={isLoading}
          onClick={onReplayClick}
        >
          {t('final_round_result.replay')}
        </Button>
        <Button
          variant="gray"
          size="l"
          onClick={() => router.push(`/map/${mapId}`)}
        >
          {t('final_round_result.exit')}
        </Button>
      </div>
    </>
  )
}

export default memo(FinalRoundResult)
