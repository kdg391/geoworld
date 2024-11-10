'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { DEFAULT_ROUNDS } from '@/constants/game.js'

import { useTranslation } from '@/i18n/client.js'

import type { Map } from '@/types/index.js'

const Button = dynamic(() => import('@/components/common/Button/index.js'))
const MapSettingsModal = dynamic(
  () => import('@/components/MapSettingsModal/index.js'),
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
        disabled={mapData.locations_count <= DEFAULT_ROUNDS}
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

      <MapSettingsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        mapData={mapData}
        userId={userId}
      />
    </>
  )
}

export default PlayButton
