'use client'

import dynamic from 'next/dynamic'
import { useFormStatus } from 'react-dom'

import type { ComponentProps } from 'react'

const Button = dynamic(() => import('../Button/index.js'))

type Props = ComponentProps<'button'> & {
  disabled?: boolean
  full?: boolean
  size?: 's' | 'm' | 'l'
  pendingText?: string
}

const SubmitButton = ({
  children,
  disabled = false,
  full = false,
  size = 'm',
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
      variant="primary"
      isLoading={disabled || isPending}
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
