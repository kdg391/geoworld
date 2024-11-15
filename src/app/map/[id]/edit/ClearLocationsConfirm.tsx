import { useTranslation } from '@/i18n/client.js'

import Button from '@/components/common/Button/index.js'
import Modal from '@/components/common/Modal/index.js'

interface Props {
  clearLocations: () => void
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ClearLocationsConfirm = ({
  clearLocations,
  isOpen,
  setIsOpen,
}: Props) => {
  const { t } = useTranslation(['common'])

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Header>
        <Modal.Title>Clear All Locations</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          Are you sure you want to clear all locations?
        </Modal.Description>
      </Modal.Content>
      <Modal.Footer>
        <Modal.Actions>
          <Button size="s" variant="gray" onClick={() => setIsOpen(false)}>
            {t('cancel')}
          </Button>
          <Button size="s" variant="danger" onClick={() => clearLocations()}>
            Clear
          </Button>
        </Modal.Actions>
      </Modal.Footer>
    </Modal>
  )
}

export default ClearLocationsConfirm
