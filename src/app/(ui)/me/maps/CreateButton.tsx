'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

const Button = dynamic(() => import('@/components/common/Button/index.tsx'))
const MapSettingsModal = dynamic(
  () => import('@/components/MapSettingsModal/index.tsx'),
)

const CreateButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <MapSettingsModal
        isEditing={false}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
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

export default CreateButton
