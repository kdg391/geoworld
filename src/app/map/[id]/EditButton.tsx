'use client'

import { useRouter } from 'next/navigation'

const EditButton = ({ mapId }: { mapId: string }) => {
  const router = useRouter()

  return (
    <div>
      <button onClick={() => router.push(`/maps/edit/${mapId}`)}>Edit</button>
      <button disabled>Delete</button>
    </div>
  )
}

export default EditButton
