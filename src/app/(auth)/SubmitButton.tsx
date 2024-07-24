'use client'

import dynamic from 'next/dynamic'
import { useFormStatus } from 'react-dom'

import type { ComponentProps } from 'react'

const Button = dynamic(() => import('../../components/common/Button/index.js'))

type Props = ComponentProps<'button'> & {
  pendingText?: string
}

const SubmitButton = ({ children, pendingText, ...props }: Props) => {
  'use client'
  const { pending, action } = useFormStatus()

  const isPending = pending && action === props.formAction

  return (
    <Button
      variant="primary"
      type="submit"
      disabled={isPending}
      aria-disabled={isPending}
      {...props}
    >
      {isPending ? pendingText : children}
    </Button>
  )
}

export default SubmitButton
