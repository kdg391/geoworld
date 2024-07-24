'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { ONE_DAY } from '../../../constants/index.js'

import { createClient } from '../../../utils/supabase/server.js'

import {
  emailValidation,
  passwordValidation,
} from '../../../utils/validations/auth.js'

import type { Profile } from '../../../types/index.js'
import type { FormState as PasswordFormState } from './PasswordForm.js'
import type { FormState as EmailFormState } from './EmailForm.js'
import type { FormState as DisplayNameFormState } from './DisplayNameForm.js'

const getEmailValidation = (prevEmail: string) =>
  emailValidation.refine(
    (e) => e !== prevEmail.trim(),
    'The email is the same as before.',
  )

export const changeEmail = async (_: EmailFormState, formData: FormData) => {
  'use server'

  const supabase = createClient(true)

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser()

  if (!user || uErr) return redirect('/sign-in')

  if (user.email_confirmed_at) {
    const emailConfirmedAt = new Date(user.email_confirmed_at).getTime()

    if (Date.now() - emailConfirmedAt < ONE_DAY * 7 * 1000)
      return {
        data: null,
        error: 'The email can be changed one week after the last change.',
      }
  }

  if (!user.email)
    return {
      data: null,
      error: 'Cannot find your email.',
    }

  const emailValidation = getEmailValidation(user.email)
  const validated = await emailValidation.safeParseAsync(formData.get('email'))

  if (!validated.success)
    return {
      data: null,
      error: validated.error.errors[0].message,
    }

  const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
    email: validated.data.trim(),
    email_confirm: true,
  })

  return {
    data: data.user?.email ?? null,
    error: error?.message ?? null,
  }
}

const getDisplayNameValidation = (displayName: string) =>
  z
    .string({
      message: 'The display name must be a string.',
    })
    .trim()
    .min(1, 'The display name has to be filled.')
    .max(20, 'The display name must be at least 20 characters.')
    .refine(
      (n) => n !== displayName.trim(),
      'The display name is the same as before.',
    )

export const changeDisplayName = async (
  _: DisplayNameFormState,
  formData: FormData,
) => {
  'use server'

  const supabase = createClient()

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser()

  if (!user || uErr) return redirect('/sign-in')

  const { data: profileData, error: pErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Profile>()

  if (!profileData || pErr) return redirect('/sign-in')

  const displayNameValidation = getDisplayNameValidation(
    profileData.display_name,
  )
  const validated = await displayNameValidation.safeParseAsync(
    formData.get('display-name'),
  )

  if (!validated.success)
    return {
      data: null,
      error: validated.error.errors[0].message,
    }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      display_name: validated.data.trim(),
    })
    .eq('id', user.id)
    .select()
    .single<Profile>()

  return {
    data: data?.display_name ?? null,
    error: error?.message ?? null,
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
