'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import { deleteMap } from '../../../actions/map.js'

const Button = dynamic(
  () => import('../../../components/common/Button/index.js'),
)

interface Props {
  mapId: string
}

const EditButton = ({ mapId }: Props) => {
  const router = useRouter()

  return (
    <div>
      <Button
        variant="primary"
        size="m"
        onClick={() => router.push(`/map/${mapId}/edit`)}
      >
        Edit
      </Button>
      <Button
        variant="danger"
        size="m"
        onClick={async () => {
          if (
            confirm(
              'Are you sure you want to delete this map? It cannot be recovered.',
            )
          ) {
            await deleteMap(mapId)
          }
        }}
      >
        Delete
      </Button>
    </div>
  )
}

export default EditButton
