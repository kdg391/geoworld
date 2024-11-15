'use client'

import { useRouter } from 'next/navigation'
import { useActionState } from 'react'

import { deleteMap } from '@/actions/map.js'

import { useTranslation } from '@/i18n/client.js'

import Button from '@/components/common/Button/index.js'
import Modal from '@/components/common/Modal/index.js'

interface Props {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  mapId: string
}

interface FormState {
  message?: string
}

const DeleteMapConfirm = ({ isOpen, setIsOpen, mapId }: Props) => {
  const router = useRouter()

  const deleteMapAction = async () => {
    'use client'

    const res = await deleteMap(mapId)

    if (res.errors) return res

    router.push('/')
  }

  const [state, action] = useActionState<FormState, FormData>(
    deleteMapAction,
    {},
  )

  const { t } = useTranslation('common')

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Header>
        <Modal.Title>Delete this map</Modal.Title>
        <Modal.CloseButton onClick={() => setIsOpen(false)} />
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          Are you sure you want to delete this map?
          <br />
          It cannot be reserved.
        </Modal.Description>
      </Modal.Content>
      <Modal.Footer>
        <form action={action}>
          <Modal.Actions>
            <Button
              size="m"
              variant="gray"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              {t('cancel')}
            </Button>
            <Button size="m" variant="danger" type="submit">
              Delete
            </Button>
          </Modal.Actions>
        </form>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteMapConfirm
