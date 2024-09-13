'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

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
    if (isOpen) document.body.classList.add('scroll-locked')
    else document.body.classList.remove('scroll-locked')
  }, [isOpen])

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

  return createPortal(
    <div ref={elRef} className={styles.modal}>
      <div className={styles['modal-content']}>{children}</div>
    </div>,
    document.body,
  )
}

export default Modal
