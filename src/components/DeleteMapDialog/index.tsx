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
  errors?: {
    message: string
  } | null
}

const DeleteMapDialog = ({ isOpen, setIsOpen, mapId }: Props) => {
  const router = useRouter()

  const deleteMapAction = async () => {
    'use client'

    const res = await deleteMap(mapId)

    if (res.errors)
      return {
        errors: res.errors,
      }

    router.push('/')

    return {}
  }

  const [, action] = useActionState<FormState, FormData>(deleteMapAction, {})

  const { t } = useTranslation(['common', 'map-builder'])

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Header>
        <Modal.Title>
          {t('delete_map.title', {
            ns: 'map-builder',
          })}
        </Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          {t('delete_map.desc', {
            ns: 'map-builder',
          })}
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

export default DeleteMapDialog
