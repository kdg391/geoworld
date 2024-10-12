'use server'

import { redirect } from 'next/navigation'

import { auth } from '@/auth.js'

import { createClient } from '../utils/supabase/server.js'

import {
  changeDisplayNameSchema,
  changeUsernameSchema,
} from '../utils/validations/profile.js'

import type { Profile } from '../types/index.js'

export const getProfile = async (id: string) => {
  'use server'

  const session = await auth()

  const supabase = createClient({
    supabaseAccessToken: session?.supabaseAccessToken,
  })

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

  const session = await auth()

  const supabase = createClient({
    supabaseAccessToken: session?.supabaseAccessToken,
  })

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

  const session = await auth()

  if (!session) redirect('/sign-in')

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data: profile, error: pErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single<Profile>()

  if (!profile || pErr) redirect('/sign-in')

  const validated = await changeDisplayNameSchema.safeParseAsync({
    oldName: profile.display_name,
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
    .eq('id', session.user.id)

  return {
    errors: {
      message: error?.message,
    },
  }
}

export const changeUsername = async (_: unknown, formData: FormData) => {
  'use server'

  const session = await auth()

  if (!session) redirect('/sign-in')

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data: profile, error: pErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single<Profile>()

  if (!profile || pErr) redirect('/sign-in')

  const validated = await changeUsernameSchema.safeParseAsync({
    oldName: profile.username,
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

  if (usernameExists)
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
    .eq('id', session.user.id)

  return {
    errors: {
      message: error?.message,
    },
  }
}
