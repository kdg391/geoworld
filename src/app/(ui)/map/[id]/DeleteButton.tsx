'use client'

import { Trash } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import { useTranslation } from '@/i18n/client.js'

const Button = dynamic(() => import('@/components/common/Button/index.js'))
const DeleteMapDialog = dynamic(
  () => import('@/components/DeleteMapDialog/index.js'),
)

interface Props {
  mapId: string
}

const DeleteButton = ({ mapId }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { t } = useTranslation('map')

  return (
    <>
      <Button
        variant="danger"
        size="m"
        onClick={() => setIsModalOpen((o) => !o)}
      >
        <Trash size={16} />
        {t('delete')}
      </Button>

      <DeleteMapDialog
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        mapId={mapId}
      />
    </>
  )
}

export default DeleteButton
