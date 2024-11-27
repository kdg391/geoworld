'use client'

import { SquarePen } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import { useTranslation } from '@/i18n/client.js'

const Button = dynamic(() => import('@/components/common/Button/index.js'))

interface Props {
  mapId: string
}

const EditButton = ({ mapId }: Props) => {
  const router = useRouter()

  const { t } = useTranslation('map')

  return (
    <Button
      variant="primary"
      size="m"
      onClick={() => router.push(`/map/${mapId}/edit`)}
    >
      <SquarePen size={16} />
      {t('edit')}
    </Button>
  )
}

export default EditButton
