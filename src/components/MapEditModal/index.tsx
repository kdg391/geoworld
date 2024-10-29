'use client'

import dynamic from 'next/dynamic'
import { useActionState } from 'react'

import { createCommunityMap, editCommunityMap } from '@/actions/map.js'

import { useTranslation } from '@/i18n/client.js'

import '../MapSettingsModal/index.css'

const Button = dynamic(() => import('../common/Button/index.js'))
const Modal = dynamic(() => import('../Modal/index.js'))
const SubmitButton = dynamic(() => import('../common/SubmitButton/index.js'))
const TextInput = dynamic(() => import('../common/TextInput/index.js'))

interface Props {
  isEditing: boolean
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface FormState {
  errors: {
    name?: string[]
    description?: string[]
    message?: string
  } | null
}

const MapEditModal = ({ isEditing, isModalOpen, setIsModalOpen }: Props) => {
  const { t } = useTranslation('common')

  const [state, action] = useActionState<FormState, FormData>(
    isEditing ? editCommunityMap : createCommunityMap,
    {
      errors: null,
    },
  )

  return (
    <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
      <h2>{isEditing ? 'Edit Map' : 'Create Map'}</h2>
      <div>
        <form action={action}>
          <div>
            <label htmlFor="name">
              {t('name')}{' '}
              <span
                style={{
                  color: 'var(--danger)',
                }}
              >
                *
              </span>
            </label>
            <TextInput
              type="text"
              id="name"
              name="name"
              minLength={1}
              maxLength={20}
              required
            />
          </div>
          {state.errors?.name && <p>{state.errors.name}</p>}
          <div>
            <label htmlFor="description">{t('description')} (Optional)</label>
            <textarea id="description" name="description" maxLength={60} />
          </div>
          {state.errors?.description && <p>{state.errors.description}</p>}
          <div>
            <Button
              variant="gray"
              size="m"
              type="button"
              onClick={() => setIsModalOpen((o) => !o)}
            >
              {t('cancel')}
            </Button>
            <SubmitButton formAction={action}>
              {isEditing ? 'Update' : 'Create'}
            </SubmitButton>
          </div>
          {state.errors?.message && <p>{state.errors.message}</p>}
        </form>
      </div>
    </Modal>
  )
}

export default MapEditModal
