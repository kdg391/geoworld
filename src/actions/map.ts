'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '../auth.js'

import { createClient } from '../utils/supabase/server.js'

import type { Coords, Location } from '../types/index.js'

export const getMap = async (id: string) => {
  const cookieStore = await cookies()

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/maps/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieStore.toString(),
    },
  })

  const data = await res.json()

  return data
}

export const createCommunityMap = async (_: unknown, formData: FormData) => {
  'use server'

  const cookieStore = await cookies()

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/maps`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify({
      name: formData.get('name'),
      description: formData.get('description'),
    }),
  })

  const data = await res.json()

  if (!res.ok) return data

  redirect(`/map/${data.id}/edit`)
}

export const editCommunityMap = async (_: unknown, formData: FormData) => {
  'use server'

  const cookieStore = await cookies()

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/maps/${''}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify({
      name: formData.get('name'),
      description: formData.get('description'),
    }),
  })

  const data = await res.json()

  return data
}

export const updateMap = async (
  id: string,
  payload: {
    isPublished?: boolean
    locations?: Coords[]
  },
) => {
  'use server'

  const cookieStore = await cookies()

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/maps/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  return data
}

export const deleteMap = async (id: string) => {
  'use server'

  const cookieStore = await cookies()

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/maps/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieStore.toString(),
    },
  })

  const data = await res.json()

  return data
}

export const getLikes = async () => {
  'use server'

  const cookieStore = await cookies()

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/me/likes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieStore.toString(),
    },
  })

  const data = await res.json()

  return data
}

export const getLike = async (mapId: string) => {
  'use server'

  const cookieStore = await cookies()

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/likes/${mapId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieStore.toString(),
    },
  })

  const data = await res.json()

  return data
}

export const addLike = async (mapId: string) => {
  'use server'

  const cookieStore = await cookies()

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/likes/${mapId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieStore.toString(),
    },
  })

  const data = await res.json()

  return data
}

export const deleteLike = async (mapId: string) => {
  'use server'

  const cookieStore = await cookies()

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/likes/${mapId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieStore.toString(),
    },
  })

  const data = await res.json()

  return data
}

export const getLocations = async (mapId: string) => {
  'use server'

  const session = await auth()

  const supabase = createClient({
    supabaseAccessToken: session?.supabaseAccessToken,
  })

  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('map_id', mapId)
    .returns<Location[]>()

  return {
    data,
    error: error?.message ?? null,
  }
}
