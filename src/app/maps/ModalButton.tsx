'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

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
      {showModal &&
        createPortal(
          <MapEditModal setShowModal={setShowModal} userId={userId} />,
          document.body,
        )}

      <Button variant="primary" onClick={() => setShowModal((o) => !o)}>
        Create new map
      </Button>
    </>
  )
}

export default ModalButton
