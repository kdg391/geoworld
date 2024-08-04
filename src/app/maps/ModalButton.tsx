'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Button = dynamic(() => import('../../components/common/Button/index.js'))
const MapEditModal = dynamic(
  () => import('../../components/MapEditModal/index.js'),
)

const ModalButton = ({ userId }: { userId: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (isModalOpen) document.body.style.setProperty('overflow-y', 'hidden')
    else document.body.style.removeProperty('overflow-y')
  }, [isModalOpen])

  return (
    <>
      <MapEditModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        userId={userId}
      />

      <Button
        variant="primary"
        size="m"
        onClick={() => setIsModalOpen((o) => !o)}
      >
        Create new map
      </Button>
    </>
  )
}

export default ModalButton
