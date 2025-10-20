'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useActionState, useState } from 'react'

import { updateMap } from '@/actions/map.ts'

import { useTranslation } from '@/i18n/client.ts'

import type { Coords } from '@/types/location.ts'

const Button = dynamic(() => import('../common/Button/index.tsx'))
const Modal = dynamic(() => import('../common/Modal/index.tsx'))
const SubmitButton = dynamic(() => import('../common/SubmitButton/index.tsx'))
const Switch = dynamic(() => import('../common/Switch/index.tsx'))

interface State {
  error: string | null
}

interface Props {
  defaultChecked: boolean
  locations: Coords[]
  mapId: string
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SaveMapModal = ({
  defaultChecked,
  locations,
  mapId,
  isModalOpen,
  setIsModalOpen,
}: Props) => {
  const router = useRouter()

  const [checked, setIsChecked] = useState(defaultChecked)

  const update = async () => {
    'use client'

    const { errors: mErr } = await updateMap(mapId, {
      isPublished: checked,
      locations,
    })

    if (mErr)
      return {
        error: mErr.message ?? null,
      }

    router.push('/')

    return {
      error: null,
    }
  }

  const [state, action] = useActionState<State, FormData>(update, {
    error: null,
  })

  const { t } = useTranslation('common')

  return (
    <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
      <h1>Save Map</h1>
      <form action={action}>
        <div>
          <Switch
            id="is-published"
            name="is-published"
            defaultChecked={defaultChecked}
            onChange={(event) => setIsChecked(event.target.checked)}
          />
          <label htmlFor="is-published">Publish</label>
        </div>
        <div>
          <Button
            size="m"
            variant="gray"
            type="button"
            onClick={() => setIsModalOpen(false)}
          >
            {t('cancel')}
          </Button>
          <SubmitButton size="m" type="submit" formAction={action}>
            Save
          </SubmitButton>
        </div>
      </form>
      {state.error && <p>{state.error}</p>}
    </Modal>
  )
}

export default SaveMapModal
