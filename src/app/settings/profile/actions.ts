'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { createClient } from '../../../utils/supabase/server.js'

import type { Profile } from '../../../types/index.js'

import type { FormState as DisplayNameFormState } from './DisplayNameForm.js'
import type { FormState as UsernameFormState } from './UsernameForm.js'

const displayNameValidation = z
  .object({
    oldName: z.string(),
    newName: z
      .string()
      .trim()
      .min(1, 'The display name has to be filled.')
      .max(20, 'The display name must be at least 20 characters.'),
  })
  .superRefine(({ oldName, newName }, ctx) => {
    if (oldName === newName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'The display name is the same as before.',
        path: ['newName'],
      })
    }
  })

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

  const validated = await displayNameValidation.safeParseAsync({
    oldName: profileData.display_name,
    newName: formData.get('display-name'),
  })

  if (!validated.success)
    return {
      data: null,
      errors: validated.error.flatten().fieldErrors,
    }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      display_name: validated.data.newName.trim(),
    })
    .eq('id', user.id)
    .select()
    .single<Profile>()

  return {
    data: data?.display_name ?? null,
    errors: {
      message: error?.message,
    },
  }
}

const usernameValidation = z
  .object({
    oldName: z.string(),
    newName: z
      .string()
      .trim()
      .min(1, 'The username has to be filled.')
      .max(20, 'The username must be at least 20 characters.'),
  })
  .superRefine(({ oldName, newName }, ctx) => {
    if (oldName === newName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'The username is the same as before.',
        path: ['newName'],
      })
    }
  })

export const changeUsername = async (
  _: UsernameFormState,
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

  const validated = await usernameValidation.safeParseAsync({
    oldName: profileData.username,
    newName: formData.get('username'),
  })

  if (!validated.success)
    return {
      data: null,
      errors: validated.error.flatten().fieldErrors,
    }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      username: validated.data.newName.trim(),
    })
    .eq('id', user.id)
    .select()
    .single<Profile>()

  return {
    data: data?.username ?? null,
    errors: {
      message: error?.message,
    },
  }
}
