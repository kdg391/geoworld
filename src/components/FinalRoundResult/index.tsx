'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { memo } from 'react'

import { createGame } from '../../actions/game.js'

import { useTranslation } from '../../i18n/client.js'

import styles from '../RoundResult/index.module.css'

import type { GameSettings, Map } from '../../types/index.js'

const Button = dynamic(() => import('../common/Button/index.js'))

interface Props {
  mapData: Map
  settings: GameSettings
  totalScore: number
  userId: string
}

const FinalRoundResult = ({ mapData, settings, totalScore, userId }: Props) => {
  const router = useRouter()
  const { t } = useTranslation('translation')

  return (
    <>
      <h2>
        {t('finalRoundResult.points', {
          count: totalScore,
        })}
      </h2>
      <div className={styles['result-actions']}>
        <Button
          variant="primary"
          size="l"
          onClick={async () => {
            const { data: gameData, error } = await createGame({
              mapData,
              settings,
              userId,
            })

            if (!gameData || error) return

            router.push(`/game/${gameData.id}`)
          }}
        >
          {t('finalRoundResult.replay')}
        </Button>
        <Button variant="secondary" size="l" onClick={() => router.push('/')}>
          {t('finalRoundResult.exit')}
        </Button>
      </div>
    </>
  )
}

export default memo(FinalRoundResult)
