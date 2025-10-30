'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { memo, useState } from 'react'

import { createGame } from '@/actions/game.ts'
import { useTranslation } from '@/i18n/client.ts'

import styles from '../RoundResult/index.module.css'

import type { GameSettings, Map } from '@/types/index.ts'

const Button = dynamic(() => import('../common/Button/index.tsx'))

interface Props {
  mapData: Map
  settings: GameSettings
  totalScore: number
  name: string
}

const FinalRoundResult = ({ mapData, settings, totalScore, name }: Props) => {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const { t } = useTranslation('game')

  const onReplayClick = async () => {
    setIsLoading(true)

    const { data: gameData, error } = await createGame({
      mapData,
      settings,
      name,
    })

    if (!gameData || error) {
      setIsLoading(false)
      return
    }

    router.push(`/game/${gameData.id}`)
  }

  return (
    <>
      <h2 className={styles.title}>
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
          className={styles['next-btn']}
        >
          {t('final_round_result.replay')}
        </Button>
        <Button
          as={Link}
          href="/"
          variant="gray"
          size="l"
          className={styles['next-btn']}
        >
          {t('final_round_result.exit')}
        </Button>
      </div>
    </>
  )
}

export default memo(FinalRoundResult)
