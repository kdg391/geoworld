'use client'

import dynamic from 'next/dynamic'
import { useFormStatus } from 'react-dom'

import type { ComponentProps } from 'react'

const Button = dynamic(() => import('../../components/common/Button/index.js'))

type Props = ComponentProps<'button'> & {
  full?: boolean
  size?: 's' | 'm' | 'l'
  pendingText?: string
}

const SubmitButton = ({
  children,
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
      type="submit"
      key={Math.random()}
      disabled={isPending}
      aria-disabled={isPending}
      isLoading={isPending}
      {...props}
    >
      {pendingText && isPending ? pendingText : children}
    </Button>
  )
}

export default SubmitButton
