'use client'

import { useEffect, useRef } from 'react'

import styles from './index.module.css'
import './index.css'

interface Props {
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Modal = ({ children, isOpen, setIsOpen }: Props) => {
  const elRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (isOpen && elRef.current && elRef.current === event.target) {
        setIsOpen(false)
      }
    }

    window.addEventListener('click', onClick)

    return () => window.removeEventListener('click', onClick)
  }, [isOpen])

  if (!isOpen) return

  return (
    <div ref={elRef} className={styles.modal}>
      <div className={styles['modal-content']}>{children}</div>
    </div>
  )
}

export default Modal
