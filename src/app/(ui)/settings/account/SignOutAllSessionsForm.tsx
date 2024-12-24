'use client'

import { useActionState } from 'react'

import Button from '@/components/common/Button/index.js'

const SignOutAllSessionsForm = () => {
  'use client'

  const [, action] = useActionState<{}, FormData>((_, formData) => {
    return Promise.resolve(formData)
  }, {})

  return (
    <form action={action}>
      <Button type="submit" variant="danger">
        Sign Out of All Sessions
      </Button>
    </form>
  )
}

export default SignOutAllSessionsForm
