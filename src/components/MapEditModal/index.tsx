'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { createCommunityMap } from '../../actions/map.js'

import { useTranslation } from '../../i18n/client.js'

// import styles from './index.module.css'
import '../MapSettingsModal/index.css'

const Button = dynamic(() => import('../common/Button/index.js'))
const Modal = dynamic(() => import('../Modal/index.js'))
const Switch = dynamic(() => import('../common/Switch/index.js'))

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  showModal: boolean
  userId: string
}

export interface State {
  errors: {} | null
}

const MapEditModal = ({ setShowModal, showModal, userId }: Props) => {
  const router = useRouter()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(true)

  const { t } = useTranslation('translation')

  return (
    <Modal isOpen={showModal}>
      <h2>Create Map</h2>
      <div>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description">Description (Optional)</label>
          <input
            type="text"
            id="description"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="is-public">Public</label>
          <Switch
            id="is-public"
            defaultChecked={isPublic}
            onChange={(event) => setIsPublic(event.target.checked)}
          />
        </div>
      </div>
      <div>
        <Button variant="gray" size="m" onClick={() => setShowModal((o) => !o)}>
          {t('cancel')}
        </Button>
        <Button
          variant="primary"
          size="m"
          onClick={async () => {
            const { data: mapData, errors } = await createCommunityMap({
              name: name.trim(),
              description:
                description.trim() === '' ? null : description.trim(),
              creator: userId,
              isPublic,
            })

            if (!mapData || errors) return

            router.push(`/maps/edit/${mapData.id}`)
          }}
        >
          Create
        </Button>
      </div>
    </Modal>
  )
}

export default MapEditModal
