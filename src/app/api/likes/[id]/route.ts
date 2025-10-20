import { and, eq } from 'drizzle-orm'

import { db } from '@/db/index.ts'
import { likesTable } from '@/db/schema.ts'
import { getCurrentSession } from '@/lib/session.ts'

export const GET = async (
  _: Request,
  segmentData: { params: Promise<{ id: string }> },
) => {
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

  const params = await segmentData.params

  const result = await db
    .select()
    .from(likesTable)
    .where(and(eq(likesTable.userId, user.id), eq(likesTable.mapId, params.id)))

  const data = result[0] ?? null

  return Response.json({
    data: data !== null,
  })
}

export const POST = async (
  _: Request,
  segmentData: { params: Promise<{ id: string }> },
) => {
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

  const params = await segmentData.params

  const result = await db
    .select()
    .from(likesTable)
    .where(and(eq(likesTable.userId, user.id), eq(likesTable.mapId, params.id)))

  const data = result[0] ?? null

  if (data !== null)
    return Response.json(
      {
        errors: {
          message: 'The map is already liked.',
        },
      },
      {
        status: 500,
      },
    )

  await db.insert(likesTable).values({
    mapId: params.id,
    userId: user.id,
  })

  return Response.json({
    data: true,
  })
}

export const DELETE = async (
  _: Request,
  segmentData: { params: Promise<{ id: string }> },
) => {
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

  const params = await segmentData.params

  const result = await db
    .select()
    .from(likesTable)
    .where(and(eq(likesTable.userId, user.id), eq(likesTable.mapId, params.id)))

  const data = result[0] ?? null

  if (data === null)
    return Response.json(
      {
        errors: {
          message: 'The map is not liked.',
        },
      },
      {
        status: 500,
      },
    )

  await db
    .delete(likesTable)
    .where(and(eq(likesTable.userId, user.id), eq(likesTable.mapId, params.id)))

  return Response.json({
    data: true,
  })
}
