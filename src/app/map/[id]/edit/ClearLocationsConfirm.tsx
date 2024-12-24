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
  const { t } = useTranslation(['common', 'map-builder'])

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Header>
        <Modal.Title>
          {t('clear_all_locations.title', {
            ns: 'map-builder',
          })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          {t('clear_all_locations.desc', {
            ns: 'map-builder',
          })}
        </Modal.Description>
      </Modal.Content>
      <Modal.Footer>
        <Modal.Actions>
          <Button size="s" variant="gray" onClick={() => setIsOpen(false)}>
            {t('cancel')}
          </Button>
          <Button size="s" variant="danger" onClick={() => clearLocations()}>
            {t('clear', {
              ns: 'map-builder',
            })}
          </Button>
        </Modal.Actions>
      </Modal.Footer>
    </Modal>
  )
}

export default ClearLocationsConfirm
