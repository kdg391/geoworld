import { eq } from 'drizzle-orm'

import { db } from '@/db/index.ts'
import { likesTable } from '@/db/schema.ts'
import { getCurrentSession } from '@/lib/session.ts'
import { camelCaseToSnakeCase } from '@/utils/casing.ts'

import type { APILike } from '@/types/like.ts'

export const GET = async () => {
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

  const data = await db
    .select()
    .from(likesTable)
    .where(eq(likesTable.userId, user.id))

  return Response.json({
    data: camelCaseToSnakeCase<APILike>(
      data.map((d) => ({
        ...d,
        createdAt: d.createdAt.toISOString(),
      })),
    ),
  })
}
