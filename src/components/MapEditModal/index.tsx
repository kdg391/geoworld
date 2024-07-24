'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { createCommunityMap } from '../../actions/map.js'

import styles from './index.module.css'
import '../MapSettingsModal/index.css'

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  userId: string
}

export interface State {
  errors: {} | null
}

const MapEditModal = ({ setShowModal, userId }: Props) => {
  const router = useRouter()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  return (
    <div className={styles['map-edit-modal']}>
      <div className={styles['map-edit-modal-wrapper']}>
        <h2>Create Map</h2>
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
          <button onClick={() => setShowModal((o) => !o)}>Cancel</button>
          <button
            onClick={async () => {
              const { data: mapData, errors } = await createCommunityMap({
                name: name.trim(),
                description:
                  description.trim() === '' ? null : description.trim(),
                creator: userId,
                public: true, // todo
              })

              if (!mapData || errors) return

              router.push(`/maps/edit/${mapData.id}`)
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}

export default MapEditModal
