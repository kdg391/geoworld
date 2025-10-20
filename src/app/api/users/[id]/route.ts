import { eq } from 'drizzle-orm'

import { db } from '@/db/index.ts'
import { profilesTable } from '@/db/schema.ts'
import { camelCaseToSnakeCase } from '@/utils/casing.ts'

import type { APIProfile } from '@/types/profile.ts'

export const revalidate = 300

export const GET = async (
  _: Request,
  segmentData: { params: Promise<{ id: string }> },
) => {
  const params = await segmentData.params

  const result = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.id, params.id))

  const data = result[0] ?? null

  if (data === null)
    return Response.json(
      {
        errors: {
          message: 'User Not Found',
        },
        code: 'user_not_found',
      },
      {
        status: 404,
      },
    )

  return Response.json({
    data: camelCaseToSnakeCase<APIProfile>({
      ...data,
      updatedAt: data.updatedAt?.toISOString() ?? null,
    }),
  })
}
