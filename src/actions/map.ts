'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { snakeCaseToCamelCase } from '../utils/casing.ts'

import type { Coords } from '../types/location.ts'
import type { APIMap, Map } from '../types/map.ts'

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
