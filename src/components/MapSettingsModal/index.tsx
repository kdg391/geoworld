'use client'

import dynamic from 'next/dynamic'
import { useActionState } from 'react'

import { createCommunityMap, editCommunityMap } from '@/actions/map.js'

import { useTranslation } from '@/i18n/client.js'

import Modal from '../common/Modal/index.js'

import styles from './index.module.css'

import type { Map } from '@/types/map.js'

const Button = dynamic(() => import('../common/Button/index.js'))
const SubmitButton = dynamic(() => import('../common/SubmitButton/index.js'))
const TextInput = dynamic(() => import('../common/TextInput/index.js'))
const Textarea = dynamic(() => import('../common/Textarea/index.js'))

interface Props {
  isEditing: boolean
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  mapData?: Map
}

interface FormState {
  errors: {
    name?: string[]
    description?: string[]
    message?: string
  } | null
}

const MapSettingsModal = ({
  isEditing,
  isModalOpen,
  setIsModalOpen,
  mapData,
}: Props) => {
  const { t } = useTranslation(['common', 'map-settings'])

  const [state, action] = useActionState<FormState, FormData>(
    isEditing ? editCommunityMap : createCommunityMap,
    {
      errors: null,
    },
  )

  return (
    <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
      <Modal.Header>
        <Modal.Title>
          {t('title', {
            ns: 'map-settings',
          })}
        </Modal.Title>
      </Modal.Header>
      <form action={action}>
        <Modal.Content>
          <div className={styles.field}>
            <label htmlFor="name">
              {t('name', {
                ns: 'map-settings',
              })}
              <span className={styles.required}>*</span>
            </label>
            <TextInput
              type="text"
              id="name"
              name="name"
              minLength={1}
              maxLength={20}
              defaultValue={mapData?.name ?? ''}
              required
            />
          </div>
          {state.errors?.name && <p>{state.errors.name}</p>}
          <div className={styles.field}>
            <label htmlFor="description">
              {t('description', {
                ns: 'map-settings',
              })}
            </label>
            <Textarea
              id="description"
              name="description"
              maxLength={60}
              defaultValue={mapData?.description ?? ''}
            />
          </div>
          {state.errors?.description && <p>{state.errors.description}</p>}
        </Modal.Content>
        <Modal.Footer>
          <Modal.Actions>
            <Button
              variant="gray"
              size="s"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              {t('cancel')}
            </Button>
            <SubmitButton size="s" formAction={action}>
              {t('save')}
            </SubmitButton>
          </Modal.Actions>
          {state.errors?.message && <p>{state.errors.message}</p>}
        </Modal.Footer>
      </form>
    </Modal>
  )
}

export default MapSettingsModal
