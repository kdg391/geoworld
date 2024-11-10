'use client'

import { SquarePen } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

const Button = dynamic(() => import('@/components/common/Button/index.js'))

interface Props {
  mapId: string
}

const EditButton = ({ mapId }: Props) => {
  const router = useRouter()

  return (
    <Button
      variant="primary"
      size="m"
      onClick={() => router.push(`/map/${mapId}/edit`)}
    >
      <SquarePen size={16} />
      Edit
    </Button>
  )
}

export default EditButton
