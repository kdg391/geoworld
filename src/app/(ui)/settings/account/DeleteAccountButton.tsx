'use client'

import { useState } from 'react'

import Button from '@/components/common/Button/index.tsx'
import Modal from '@/components/common/Modal/index.tsx'
import { useTranslation } from '@/i18n/client.ts'

import DeleteAccountForm from './DeleteAccountForm.tsx'

const DeleteAccountButton = () => {
  const [isFormOpened, setIsFormOpened] = useState(false)

  const { t } = useTranslation('settings')

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
