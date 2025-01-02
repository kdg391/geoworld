'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getCurrentSession } from '../lib/session.js'

import { snakeCaseToCamelCase } from '../utils/index.js'
import { createClient } from '../utils/supabase/server.js'

import type { APILocation, Coords, Location } from '../types/location.js'
import type { APIMap, Map } from '../types/map.js'

export const getMap = async (id: string) => {
  const cookieStore = await cookies()

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/maps/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieStore.toString(),
    },
  })

  const { data, errors } = (await res.json()) as {
    data?: APIMap
    errors?: {
      message: string
    }
  }

  return {
    data: data
      ? ({
          ...snakeCaseToCamelCase<Map>(data),
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        } as Map)
      : null,
    errors: errors ?? null,
  }
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

  const { data, errors } = (await res.json()) as {
    data?: Map
    errors?: {
      name?: string[]
      description?: string[]
      message?: string
    }
  }

  if (!data)
    return {
      errors: errors ?? null,
    }

  redirect(`/map/${data.id}/edit`)
}

export const editCommunityMap = async (_: unknown, formData: FormData) => {
  'use server'

  const cookieStore = await cookies()

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/maps/${formData.get('map-id')}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify({
        name: formData.get('name'),
        description: formData.get('description'),
      }),
    },
  )

  const { errors } = (await res.json()) as {
    errors?: {
      name?: string[]
      description?: string[]
      isPublished?: string[]
      locations?: string[]
      message?: string
    }
  }

  return {
    errors: errors ?? null,
  }
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

  const { data, errors } = (await res.json()) as {
    data?: APIMap
    errors?: {
      name?: string[]
      description?: string[]
      isPublished?: string[]
      locations?: string[]
      message?: string
    } | null
  }

  return {
    data: data
      ? ({
          ...snakeCaseToCamelCase<Map>(data),
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        } as Map)
      : null,
    errors: errors ?? null,
  }
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

  const { data, errors } = (await res.json()) as {
    data?: boolean
    errors?: {
      message: string
    }
  }

  return {
    data: data ?? false,
    errors: errors ?? null,
  }
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

  const { session } = await getCurrentSession()

  const supabase = createClient({
    supabaseAccessToken: session?.supabaseAccessToken,
  })

  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('map_id', mapId)
    .returns<APILocation[]>()

  if (error)
    return {
      data: null,
      errors: {
        message: 'Something went wrong!',
      },
    }

  return {
    data: snakeCaseToCamelCase<Location[]>(data),
    errors: null,
  }
}
