'use server'

import { redirect } from 'next/navigation'

import { createClient } from '../../../utils/supabase/server.js'

import {
  displayNameValidation,
  usernameValidation,
} from '../../../utils/validations/profile.js'

import type { Profile } from '../../../types/index.js'

import type { FormState as DisplayNameFormState } from './DisplayNameForm.js'
import type { FormState as UsernameFormState } from './UsernameForm.js'

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
      display_name: validated.data.newName,
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
