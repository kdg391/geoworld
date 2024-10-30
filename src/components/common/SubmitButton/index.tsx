'use client'

import { useFormStatus } from 'react-dom'

import Button from '../Button/index.js'

import type { ComponentProps } from 'react'

type Props = ComponentProps<'button'> & {
  disabled?: boolean
  full?: boolean
  isLoading?: boolean
  leftIcon?: React.ReactNode
  size?: 's' | 'm' | 'l'
  variant?: 'primary' | 'danger'
  pendingText?: string
}

const SubmitButton = ({
  children,
  disabled = false,
  full = false,
  isLoading = false,
  leftIcon,
  size = 'm',
  variant = 'primary',
  pendingText,
  ref,
  ...props
}: Props) => {
  'use client'

  const { pending, action } = useFormStatus()

  const isPending = pending && action === props.formAction

  void ref

  return (
    <Button
      full={full}
      size={size}
      variant={variant}
      isLoading={(isLoading && disabled) || isPending}
      leftIcon={leftIcon}
      key={Math.random()}
      type="submit"
      disabled={disabled || isPending}
      {...props}
    >
      {pendingText && isPending ? pendingText : children}
    </Button>
  )
}

export default SubmitButton
