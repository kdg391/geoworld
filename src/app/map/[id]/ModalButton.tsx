'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import type { Map } from '../../../types/index.js'

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

  useEffect(() => {
    if (showModal) document.body.style.setProperty('overflow-y', 'hidden')
    else document.body.style.removeProperty('overflow-y')
  }, [showModal])

  return (
    <>
      {showModal && (
        <MapSettingsModal
          mapData={mapData}
          setShowModal={setShowModal}
          userId={userId}
        />
      )}

      <button
        onClick={() => {
          if (!userId) {
            router.push('/sign-in')
            return
          }

          setShowModal((s) => !s)
        }}
      >
        Play
      </button>
    </>
  )
}

export default ModalButton
