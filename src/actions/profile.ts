'use server'

import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { db } from '../db/index.ts'
import { profilesTable } from '../db/schema.ts'
import { getCurrentSession } from '../lib/session.ts'
import { snakeCaseToCamelCase } from '../utils/casing.ts'
import {
  changeDisplayNameSchema,
  changeUsernameSchema,
  setupProfileSchema,
} from '../utils/validations/profile.ts'

import type { APIProfile, Profile } from '../types/profile.ts'

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

  const result = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.username, username))

  const data = result[0] ?? null

  return {
    data,
    errors: null,
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

  const { data: profile } = await getProfile(user.id)

  if (!profile) redirect('/sign-in')

  const validated = await changeDisplayNameSchema.safeParseAsync({
    oldName: profile.displayName,
    newName: formData.get('display-name'),
  })

  if (!validated.success)
    return {
      errors: z.flattenError(validated.error).fieldErrors,
    }

  await db
    .update(profilesTable)
    .set({
      displayName: validated.data.newName,
      updatedAt: new Date(),
    })
    .where(eq(profilesTable.id, user.id))

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

  const { data: profile } = await getProfile(user.id)

  if (!profile) redirect('/sign-in')

  const validated = await changeUsernameSchema.safeParseAsync({
    oldName: profile.username,
    newName: formData.get('username'),
  })

  if (!validated.success)
    return {
      errors: z.flattenError(validated.error).fieldErrors,
    }

  const usernameExists = await checkUsernameExists(validated.data.newName)

  if (usernameExists)
    return {
      errors: {
        newName: ['The username already exists.'],
      },
    }

  await db
    .update(profilesTable)
    .set({
      username: validated.data.newName,
      updatedAt: new Date(),
    })
    .where(eq(profilesTable.id, user.id))

  return {
    errors: null,
  }
}

export const setupProfile = async (_: unknown, formData: FormData) => {
  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in')

  const { data: profile } = await getProfile(user.id)

  if (!profile) redirect('/sign-in')

  const validated = await setupProfileSchema.safeParseAsync({
    displayName: formData.get('display-name'),
    username: formData.get('username'),
  })

  if (!validated.success)
    return {
      errors: z.flattenError(validated.error).fieldErrors,
    }

  const usernameExists = await checkUsernameExists(validated.data.username)

  if (usernameExists)
    return {
      errors: {
        username: ['The username already exists.'],
      },
    }

  await db
    .update(profilesTable)
    .set({
      displayName: validated.data.displayName,
      username: validated.data.username,
      updatedAt: new Date(),
    })
    .where(eq(profilesTable.id, user.id))

  redirect('/dashboard')
}

const checkUsernameExists = async (username: string) => {
  const result = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.username, username))

  const data = result[0] ?? null

  return data !== null
}
