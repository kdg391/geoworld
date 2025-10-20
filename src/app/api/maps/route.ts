import { z } from 'zod'

import { db } from '@/db/index.ts'
import { mapsTable } from '@/db/schema.ts'
import { getCurrentSession } from '@/lib/session.ts'
import { camelCaseToSnakeCase } from '@/utils/casing.ts'
import { createMapSchema } from '@/utils/validations/map.ts'

import type { APIMap } from '@/types/map.ts'

export const POST = async (request: Request) => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session)
    return Response.json(
      {
        errors: {
          message: 'Unauthorized',
        },
      },
      {
        status: 401,
      },
    )

  const body = await request.json()

  const validated = await createMapSchema.safeParseAsync({
    name: body.name,
    description: body.description,
  })

  if (!validated.success)
    return Response.json(
      {
        message: 'Invalid Form Body',
        errors: z.flattenError(validated.error).fieldErrors,
      },
      {
        status: 400,
      },
    )

  const [data] = await db
    .insert(mapsTable)
    .values({
      type: 'community',
      name: validated.data.name,
      description:
        validated.data.description === '' ? null : validated.data.description,
      isPublished: false,
      creator: user.id,
    })
    .returning()

  return Response.json({
    data: camelCaseToSnakeCase<APIMap>({
      ...data,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
    }),
    message: 'Successfully created the map',
  })
}
