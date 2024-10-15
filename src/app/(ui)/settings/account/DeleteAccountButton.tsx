'use client'

import { useState } from 'react'

import { useTranslation } from '@/i18n/client.js'

import Button from '@/components/common/Button/index.js'
import Modal from '@/components/Modal/index.js'
import DeleteAccountForm from './DeleteAccountForm.js'

const DeleteAccountButton = () => {
  const [isFormOpened, setIsFormOpened] = useState(false)

  const { t } = useTranslation('auth')

  return (
    <>
      <Button
        variant="danger"
        size="s"
        onClick={() => setIsFormOpened((o) => !o)}
      >
        {t('delete_account')}
      </Button>
      <Modal isOpen={isFormOpened} setIsOpen={setIsFormOpened}>
        <DeleteAccountForm />
      </Modal>
    </>
  )
}

export default DeleteAccountButton
