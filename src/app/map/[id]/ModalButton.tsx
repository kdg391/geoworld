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

const ModalButton = ({
  mapData,
  userId,
}: {
  mapData: Map
  userId?: string
}) => {
  const router = useRouter()

  const [showModal, setShowModal] = useState(false)

  const { t } = useTranslation('translation')

  useEffect(() => {
    if (showModal) document.body.style.setProperty('overflow-y', 'hidden')
    else document.body.style.removeProperty('overflow-y')
  }, [showModal])

  return (
    <>
      <MapSettingsModal
        mapData={mapData}
        setShowModal={setShowModal}
        showModal={showModal}
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

          setShowModal((s) => !s)
        }}
      >
        {t('play')}
      </Button>
    </>
  )
}

export default ModalButton
