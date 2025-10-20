'use server'

import { cookies } from 'next/headers'

export const getMyLikes = async () => {
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
