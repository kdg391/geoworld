'use server'

import { redirect } from 'next/navigation'

import { createClient } from '../utils/supabase/server.js'

import {
  displayNameValidation,
  usernameValidation,
} from '../utils/validations/profile.js'

import type { Profile } from '../types/index.js'

export const getProfile = async (id: string) => {
  'use server'

  const supabase = createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single<Profile>()

  return {
    data,
    error: error?.message ?? null,
  }
}

export const getProfileByUsername = async (username: string) => {
  'use server'

  const supabase = createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single<Profile>()

  return {
    data,
    error: error?.message ?? null,
  }
}

export const changeDisplayName = async (_: unknown, formData: FormData) => {
  'use server'

  const supabase = createClient()

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser()

  if (!user || uErr) return redirect('/sign-in')

  const { data: pData, error: pErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Profile>()

  if (!pData || pErr) return redirect('/sign-in')

  const validated = await displayNameValidation.safeParseAsync({
    oldName: pData.display_name,
    newName: formData.get('display-name'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: validated.data.newName,
    })
    .eq('id', user.id)

  return {
    errors: {
      message: error?.message,
    },
  }
}

export const changeUsername = async (_: unknown, formData: FormData) => {
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
      errors: validated.error.flatten().fieldErrors,
    }

  const { data: usernameExists, error: uNameErr } = await supabase
    .rpc('check_username_exists', {
      p_username: validated.data.newName,
    })
    .returns<boolean>()

  if (usernameExists === true)
    return {
      errors: {
        newName: ['The username already exists.'],
      },
    }

  if (uNameErr)
    return {
      errors: {
        newName: [uNameErr.message],
      },
    }

  const { error } = await supabase
    .from('profiles')
    .update({
      username: validated.data.newName.trim(),
    })
    .eq('id', user.id)

  return {
    errors: {
      message: error?.message,
    },
  }
}
