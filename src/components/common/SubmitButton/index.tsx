'use client'

import dynamic from 'next/dynamic'
import { useFormStatus } from 'react-dom'

import type { ComponentProps } from 'react'

const Button = dynamic(() => import('../Button/index.js'))

type Props = ComponentProps<'button'> & {
  disabled?: boolean
  full?: boolean
  isLoading?: boolean
  size?: 's' | 'm' | 'l'
  variant?: 'primary' | 'danger'
  pendingText?: string
}

const SubmitButton = ({
  children,
  disabled = false,
  full = false,
  isLoading = false,
  size = 'm',
  variant = 'primary',
  pendingText,
  ...props
}: Props) => {
  'use client'

  const { pending, action } = useFormStatus()

  const isPending = pending && action === props.formAction

  return (
    <Button
      full={full}
      size={size}
      variant={variant}
      isLoading={(isLoading && disabled) || isPending}
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
