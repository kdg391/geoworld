'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useTranslation } from '../../../i18n/client.js'

import type { Map } from '../../../types/index.js'

const Button = dynamic(
  () => import('../../../components/common/Button/index.js'),
)
const MapSettingsModal = dynamic(
  () => import('../../../components/MapSettingsModal/index.js'),
)

interface Props {
  mapData: Map
  userId?: string
}

const PlayButton = ({ mapData, userId }: Props) => {
  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const { t } = useTranslation('translation')

  useEffect(() => {
    if (isModalOpen) document.body.style.setProperty('overflow-y', 'hidden')
    else document.body.style.removeProperty('overflow-y')
  }, [isModalOpen])

  return (
    <>
      <MapSettingsModal
        isModalOpen={isModalOpen}
        mapData={mapData}
        setIsModalOpen={setIsModalOpen}
        userId={userId}
      />

      <Button
        variant="primary"
        size="m"
        disabled={mapData.locations_count === 0}
        onClick={() => {
          if (!userId) {
            router.push('/sign-in')
            return
          }

          setIsModalOpen((s) => !s)
        }}
      >
        {t('play')}
      </Button>
    </>
  )
}

export default PlayButton
