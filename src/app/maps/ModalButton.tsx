'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Button = dynamic(() => import('../../components/common/Button/index.js'))
const MapEditModal = dynamic(
  () => import('../../components/MapEditModal/index.js'),
)

const ModalButton = ({ userId }: { userId: string }) => {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (showModal) document.body.style.setProperty('overflow-y', 'hidden')
    else document.body.style.removeProperty('overflow-y')
  }, [showModal])

  return (
    <>
      <MapEditModal
        setShowModal={setShowModal}
        showModal={showModal}
        userId={userId}
      />

      <Button
        variant="primary"
        size="m"
        onClick={() => setShowModal((o) => !o)}
      >
        Create new map
      </Button>
    </>
  )
}

export default ModalButton
