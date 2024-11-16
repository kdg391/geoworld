'use client'

import { X } from 'lucide-react'
import { forwardRef, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { classNames } from '@/utils/index.js'

import styles from './index.module.css'

import './index.css'

interface Props {
  children?: React.ReactNode
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Modal = ({
  children,
  isOpen,
  setIsOpen,
  ...props
}: Props & React.ComponentProps<'div'>) => {
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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        event.stopPropagation()

        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  if (!isOpen) return

  return createPortal(
    <div {...props} ref={elRef} className={styles.container}>
      <div className={styles.wrapper}>{children}</div>
    </div>,
    document.body,
  )
}

const Header = forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ children, className = '', ...props }, ref) => (
    <div {...props} ref={ref} className={classNames(styles.header, className)}>
      {children}
    </div>
  ),
)

Header.displayName = 'Header'

const Title = forwardRef<HTMLHeadingElement, React.ComponentProps<'div'>>(
  ({ children, className = '', ...props }, ref) => (
    <h2 {...props} ref={ref} className={classNames(styles.title, className)}>
      {children}
    </h2>
  ),
)

Title.displayName = 'Title'

const CloseButton = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'>
>(({ className = '', onClick, ...props }, ref) => {
  return (
    <button
      {...props}
      ref={ref}
      className={classNames(styles['close-button'], className)}
      onClick={(event) => {
        onClick?.(event)
      }}
    >
      <X size={20} />
    </button>
  )
})

CloseButton.displayName = 'CloseButton'

const Content = forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ children, className = '', ...props }, ref) => (
    <div {...props} ref={ref} className={classNames(styles.content, className)}>
      {children}
    </div>
  ),
)

Content.displayName = 'Content'

const Description = forwardRef<HTMLParagraphElement, React.ComponentProps<'p'>>(
  ({ children, className = '', ...props }, ref) => (
    <p
      {...props}
      ref={ref}
      className={classNames(styles.description, className)}
    >
      {children}
    </p>
  ),
)

Description.displayName = 'Description'

const Actions = forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ children, className = '', ...props }, ref) => (
    <div {...props} ref={ref} className={classNames(styles.actions, className)}>
      {children}
    </div>
  ),
)

Actions.displayName = 'Actions'

const Footer = forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ children, className = '', ...props }, ref) => (
    <div {...props} ref={ref} className={classNames(styles.footer, className)}>
      {children}
    </div>
  ),
)

Footer.displayName = 'Footer'

Modal.Header = Header
Modal.Title = Title
Modal.CloseButton = CloseButton
Modal.Content = Content
Modal.Description = Description
Modal.Footer = Footer
Modal.Actions = Actions

export default Modal
