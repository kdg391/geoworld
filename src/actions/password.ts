'use server'

import { redirect } from 'next/navigation.js'

import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/utils/validations/auth.js'

export const forgotPassword = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await forgotPasswordSchema.safeParseAsync({
    email: formData.get('email'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/auth/reset-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: validated.data.email,
        }),
      },
    )

    const data = await response.json()

    if (data?.errors) throw new Error('Something went wrong!')
  } catch (err) {
    if (err instanceof Error)
      return {
        errors: {
          message: 'Something went wrong!',
        },
      }

    return {
      errors: null,
    }
  }

  redirect('/email-has-sent')
}

export const resetPassword = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await resetPasswordSchema.safeParseAsync({
    password: formData.get('password'),
    confirmPassword: formData.get('confirm-password'),
    token: formData.get('token'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/auth/reset-password/${validated.data.token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: validated.data.password,
        }),
      },
    )

    const data = await response.json()

    if (data.errors) throw new Error('Something went wrong!')
  } catch (err) {
    if (err instanceof Error)
      return {
        errors: {
          message: 'Something went wrong!',
        },
      }

    return {
      errors: null,
    }
  }

  redirect('/sign-in')
}
