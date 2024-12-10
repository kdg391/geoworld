'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getCurrentSession } from '../session.js'

import { snakeCaseToCamelCase } from '../utils/index.js'
import { createClient } from '../utils/supabase/server.js'
import {
  changeDisplayNameSchema,
  changeUsernameSchema,
  setupProfileSchema,
} from '../utils/validations/profile.js'

import type { APIProfile, Profile } from '../types/profile.js'

export const getProfile = async (id: string) => {
  'use server'

  const cookieStore = await cookies()

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieStore.toString(),
    },
  })

  const { data, errors } = (await res.json()) as {
    data?: APIProfile | null
    errors?: { message: string } | null
  }

  return {
    data: data
      ? ({
          ...snakeCaseToCamelCase<Profile>(data),
          updatedAt: new Date(data.updated_at),
        } as Profile)
      : null,
    errors: errors ?? null,
  }
}

export const getProfileByUsername = async (username: string) => {
  'use server'

  const { session } = await getCurrentSession()

  const supabase = createClient({
    supabaseAccessToken: session?.supabaseAccessToken,
  })

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .maybeSingle<APIProfile>()

  return {
    data: data ? snakeCaseToCamelCase<Profile>(data) : null,
    errors: error
      ? {
          message: error.message,
        }
      : null,
  }
}

export const changeDisplayName = async (_: unknown, formData: FormData) => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in')

  if (user.role !== 'user')
    return {
      errors: {
        message: 'You cannot change your display name.',
      },
    }

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data: profile } = await getProfile(user.id)

  if (!profile) redirect('/sign-in')

  const validated = await changeDisplayNameSchema.safeParseAsync({
    oldName: profile.displayName,
    newName: formData.get('display-name'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  const { error } = await supabase
    .from('profiles')
    .update<Partial<APIProfile>>({
      display_name: validated.data.newName,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error)
    return {
      errors: {
        message: 'Something went wrong!',
      },
    }

  return {
    errors: null,
  }
}

export const changeUsername = async (_: unknown, formData: FormData) => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in')

  if (user.role !== 'user')
    return {
      errors: {
        message: 'You cannot change your username.',
      },
    }

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data: profile } = await getProfile(user.id)

  if (!profile) redirect('/sign-in')

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
    .update<Partial<APIProfile>>({
      username: validated.data.newName,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error)
    return {
      errors: {
        message: error.message,
      },
    }

  return {
    errors: null,
  }
}

export const setupProfile = async (_: unknown, formData: FormData) => {
  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in')

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data: profile } = await getProfile(user.id)

  if (!profile) redirect('/sign-in')

  const validated = await setupProfileSchema.safeParseAsync({
    displayName: formData.get('display-name'),
    username: formData.get('username'),
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
        username: ['Something went wrong!'],
      },
    }

  const { error } = await supabase
    .from('profiles')
    .update<Partial<APIProfile>>({
      display_name: validated.data.displayName,
      username: validated.data.username,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error)
    return {
      errors: {
        message: error.message,
      },
    }

  redirect('/dashboard')
}
