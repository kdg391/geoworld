'use server'

import { redirect } from 'next/navigation'

import { auth } from '../auth.js'

import { createClient } from '../utils/supabase/server.js'
import {
  changeDisplayNameSchema,
  changeUsernameSchema,
  setupProfileSchema,
} from '../utils/validations/profile.js'

import type { Profile } from '../types/index.js'

export const getProfile = async (id: string) => {
  'use server'

  const { data, error } = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/users/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res.json())

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
    .maybeSingle<Profile>()

  return {
    data,
    error: error?.message ?? null,
  }
}

export const changeDisplayName = async (_: unknown, formData: FormData) => {
  'use server'

  const session = await auth()

  if (!session) redirect('/sign-in')

  if (session.user.role !== 'user')
    return {
      errors: {
        message: 'You cannot change your display name.',
      },
    }

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
    .update<Partial<Profile>>({
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

  if (session.user.role !== 'user')
    return {
      errors: {
        message: 'You cannot change your username.',
      },
    }

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

  const { data: usernameExists, error: usernameErr } = await supabase
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

  if (usernameErr)
    return {
      errors: {
        newName: [usernameErr.message],
      },
    }

  const { error } = await supabase
    .from('profiles')
    .update<Partial<Profile>>({
      username: validated.data.newName,
    })
    .eq('id', session.user.id)

  return {
    errors: {
      message: error?.message,
    },
  }
}

export const setupProfile = async (_: unknown, formData: FormData) => {
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

  const validated = await setupProfileSchema.safeParseAsync({
    username: formData.get('username'),
    displayName: formData.get('display-name'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  const { data: usernameExists, error: uNameErr } = await supabase
    .rpc('check_username_exists', {
      p_username: validated.data.username,
    })
    .returns<boolean>()

  if (usernameExists)
    return {
      errors: {
        username: ['The username already exists.'],
      },
    }

  if (uNameErr)
    return {
      errors: {
        username: [uNameErr.message],
      },
    }

  const { error } = await supabase
    .from('profiles')
    .update<Partial<Profile>>({
      username: validated.data.username,
      display_name: validated.data.displayName,
    })
    .eq('id', session.user.id)

  if (error)
    return {
      errors: {
        message: error.message,
      },
    }

  redirect('/dashboard')
}
