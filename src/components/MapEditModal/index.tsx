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
const TextInput = dynamic(() => import('../common/TextInput/index.js'))

interface Props {
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  userId: string
}

export interface State {
  errors: {} | null
}

const MapEditModal = ({ isModalOpen, setIsModalOpen, userId }: Props) => {
  const router = useRouter()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(true)

  const [isLoading, setIsLoading] = useState(false)

  const { t } = useTranslation('translation')

  const onCreateClick = async () => {
    setIsLoading(true)

    const { data: mapData, errors } = await createCommunityMap({
      name: name.trim(),
      description: description.trim() === '' ? null : description.trim(),
      creator: userId,
      isPublic,
    })

    setIsLoading(false)

    if (!mapData || errors) return

    router.push(`/maps/edit/${mapData.id}`)
  }

  return (
    <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
      <h2>Create Map</h2>
      <div>
        <div>
          <label htmlFor="name">Name</label>
          <TextInput
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
          <TextInput
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
        <Button
          variant="gray"
          size="m"
          onClick={() => setIsModalOpen((o) => !o)}
        >
          {t('cancel')}
        </Button>
        <Button
          variant="primary"
          size="m"
          isLoading={isLoading}
          onClick={onCreateClick}
        >
          Create
        </Button>
      </div>
    </Modal>
  )
}

export default MapEditModal
