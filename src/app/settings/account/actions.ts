'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { ONE_DAY } from '../../../constants/index.js'

import { createClient } from '../../../utils/supabase/server.js'

import {
  emailValidation,
  passwordValidation,
} from '../../../utils/validations/auth.js'

import type { FormState as PasswordFormState } from './PasswordForm.js'
import type { FormState as EmailFormState } from './EmailForm.js'

const changingEmailValidation = z
  .object({
    oldEmail: z.string().trim().email(),
    newEmail: emailValidation,
  })
  .superRefine(({ oldEmail, newEmail }, ctx) => {
    if (oldEmail === newEmail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'The email is the same as before.',
        path: ['newEmail'],
      })
    }
  })

export const changeEmail = async (_: EmailFormState, formData: FormData) => {
  'use server'

  const supabase = createClient(true)

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser()

  if (!user || uErr) return redirect('/sign-in')

  if (!user.email)
    return {
      data: null,
      errors: {
        message: 'Cannot find your email.',
      },
    }

  /*if (user.email_confirmed_at) {
    const emailConfirmedAt = new Date(user.email_confirmed_at).getTime()

    if (Date.now() - emailConfirmedAt < ONE_DAY * 7 * 1000)
      return {
        data: null,
        errors: {
          message: 'The email can be changed one week after the last change.',
        },
      }
  }*/

  const validated = await changingEmailValidation.safeParseAsync({
    oldEmail: user.email,
    newEmail: formData.get('email'),
  })

  if (!validated.success)
    return {
      data: null,
      errors: validated.error.flatten().fieldErrors,
    }

  const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
    email: validated.data.newEmail,
    email_confirm: true,
  })

  return {
    data: data.user?.email ?? null,
    errors: {
      message: error?.message,
    },
  }
}

const changePasswordValidation = z
  .object({
    oldPassword: z.string(),
    newPassword: passwordValidation,
    confirmPassword: z.string(),
  })
  .superRefine(async ({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'The confirm password is not matched.',
        path: ['confirmPassword'],
      })
    }
  })

export const changePassword = async (
  _: PasswordFormState,
  formData: FormData,
) => {
  'use server'

  const supabase = createClient(true)

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser()

  if (!user || uErr) return redirect('/sign-in')

  const validated = await changePasswordValidation.safeParseAsync({
    oldPassword: formData.get('old-password'),
    newPassword: formData.get('new-password'),
    confirmPassword: formData.get('confirm-password'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  const { data, error } = await supabase.rpc('verify_user_password', {
    password: validated.data.oldPassword,
  })

  if (error)
    return {
      errors: {
        oldPassword: [error?.message],
      },
    }

  if (!data)
    return {
      errors: {
        oldPassword: ['The old password is not matched.'],
      },
    }

  const { error: updatedErr } = await supabase.auth.admin.updateUserById(
    user.id,
    {
      password: validated.data.newPassword,
    },
  )

  return {
    errors: {
      message: updatedErr?.message,
    },
  }
}
