'use client'

import { Trash } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useActionState, useState } from 'react'

import { deleteMap } from '@/actions/map.js'

const Button = dynamic(() => import('@/components/common/Button/index.js'))
const Modal = dynamic(() => import('@/components/Modal/index.js'))

interface FormState {
  errors: {
    message?: string
  } | null
}

interface Props {
  mapId: string
}

const DeleteButton = ({ mapId }: Props) => {
  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const deleteAction = async () => {
    'use client'

    const { errors } = await deleteMap(mapId)

    if (errors) return errors

    router.push('/')
  }

  const [state, action] = useActionState<FormState, FormData>(deleteAction, {
    errors: null,
  })

  return (
    <>
      <Button
        variant="danger"
        size="m"
        onClick={() => setIsModalOpen((o) => !o)}
      >
        <Trash size={16} />
        Delete
      </Button>

      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <div>
          <div>Are you sure you want to delete this map?</div>
          <p>It cannot be recovered.</p>
          <form action={action}>
            <div className="flex">
              <Button
                variant="gray"
                size="m"
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" size="m" type="submit">
                Delete
              </Button>
            </div>
            {state.errors?.message && <p>{state.errors.message}</p>}
          </form>
        </div>
      </Modal>
    </>
  )
}

export default DeleteButton
