'use client'

import styles from './index.module.css'

import './index.css'

interface Props {
  children: React.ReactNode
  isOpen: boolean
}

const Modal = ({ children, isOpen }: Props) => {
  if (!isOpen) return

  return (
    <div className={styles.modal}>
      <div className={styles['modal-content']}>{children}</div>
    </div>
  )
}

export default Modal
