'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { DEFAULT_ROUNDS } from '@/constants/game.js'

import { useTranslation } from '@/i18n/client.js'

import type { Map } from '@/types/map.js'

const Button = dynamic(() => import('@/components/common/Button/index.js'))
const GameSettingsModal = dynamic(
  () => import('@/components/GameSettingsModal/index.js'),
  {
    loading: () => <></>,
  },
)

interface Props {
  mapData: Map
  userId?: string
}

const PlayButton = ({ mapData, userId }: Props) => {
  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const { t } = useTranslation('common')

  return (
    <>
      <Button
        variant="primary"
        size="m"
        disabled={mapData.locationsCount <= DEFAULT_ROUNDS}
        onClick={() => {
          if (!userId) {
            router.push(`/sign-in?next=/map/${mapData.id}`)
            return
          }

          setIsModalOpen(true)
        }}
      >
        {t('play')}
      </Button>

      <GameSettingsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        mapData={mapData}
        userId={userId}
      />
    </>
  )
}

export default PlayButton
