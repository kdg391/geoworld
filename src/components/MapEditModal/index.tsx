'use client'

import dynamic from 'next/dynamic'
import { useFormState } from 'react-dom'

import { createCommunityMap } from '@/actions/map.js'

import { useTranslation } from '@/i18n/client.js'

// import styles from './index.module.css'
import '../MapSettingsModal/index.css'

const Button = dynamic(() => import('../common/Button/index.js'))
const Modal = dynamic(() => import('../Modal/index.js'))
const SubmitButton = dynamic(() => import('../common/SubmitButton/index.js'))
const TextInput = dynamic(() => import('../common/TextInput/index.js'))

interface Props {
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export interface FormState {
  errors: {
    name?: string[]
    description?: string[]
    message?: string
  } | null
}

const MapEditModal = ({ isModalOpen, setIsModalOpen }: Props) => {
  const { t } = useTranslation('translation')

  const [state, action] = useFormState<FormState, FormData>(
    createCommunityMap,
    {
      errors: null,
    },
  )

  return (
    <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
      <h2>Create Map</h2>
      <div>
        <form action={action}>
          <div>
            <label htmlFor="name">
              Name <span>*</span>
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
            <label htmlFor="description">Description (Optional)</label>
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
            <SubmitButton formAction={action}>Create</SubmitButton>
          </div>
          {state.errors?.message && <p>{state.errors.message}</p>}
        </form>
      </div>
    </Modal>
  )
}

export default MapEditModal
