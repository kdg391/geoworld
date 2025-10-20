import { and, eq, inArray, sql, type SQL } from 'drizzle-orm'
import { z } from 'zod'

import {
  OFFICIAL_MAP_COUNTRY_CODES,
  OFFICIAL_MAP_WORLD_ID,
} from '@/constants/index.ts'
import { db } from '@/db/index.ts'
import { locationsTable, mapsTable } from '@/db/schema.ts'
import { createTranslation } from '@/i18n/server.ts'
import { getCurrentSession } from '@/lib/session.ts'
import { calculateMapBounds, calculateScoreFactor } from '@/utils/game.ts'
import { camelCaseToSnakeCase } from '@/utils/casing.ts'
import { getCountryFromCoordinates } from '@/utils/map.ts'
import { mapDescriptionSchema, mapNameSchema } from '@/utils/validations/map.ts'

import type { APIMap, Map } from '@/types/map.ts'

export const GET = async (
  _: Request,
  segmentData: { params: Promise<{ id: string }> },
) => {
  'use server'

  const params = await segmentData.params

  const result = await db
    .select()
    .from(mapsTable)
    .where(eq(mapsTable.id, params.id))

  const data = result[0] ?? null

  if (data === null)
    return Response.json(
      {
        errors: {
          message: 'Map Not Found',
        },
      },
      {
        status: 404,
      },
    )

  if (data.type === 'official') {
    const { t } = await createTranslation(['common', 'country'])

    data.name =
      data.id === OFFICIAL_MAP_WORLD_ID
        ? t('world')
        : data.id in OFFICIAL_MAP_COUNTRY_CODES
          ? t(`country:${OFFICIAL_MAP_COUNTRY_CODES[data.id]}`)
          : data.name
  }

  return Response.json({
    data: camelCaseToSnakeCase<APIMap>({
      ...data,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
    }),
  })
}

const schema = z.object({
  isPublished: z.boolean().optional(),
  locations: z
    .array(
      z.object({
        lat: z.number(),
        lng: z.number(),
        heading: z.number(),
        panoId: z.string(),
        pitch: z.number(),
        zoom: z.number(),
      }),
    )
    .optional(),
  name: mapNameSchema.optional(),
  description: mapDescriptionSchema.optional(),
})

export const PATCH = async (
  request: Request,
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

  const mapResult = await db
    .select()
    .from(mapsTable)
    .where(eq(mapsTable.id, params.id))

  const mapData = mapResult[0] ?? null

  if (mapData === null)
    return Response.json(
      {
        errors: {
          message: 'Map Not Found',
        },
      },
      {
        status: 404,
      },
    )

  if (mapData.creator !== user.id)
    return Response.json(
      {
        errors: {
          message: 'This map is not your map.',
        },
      },
      {
        status: 401,
      },
    )

  if (mapData.type === 'official' && user.role !== 'admin')
    return Response.json(
      {
        errors: {
          message: 'You cannot edit the official map.',
        },
      },
      {
        status: 401,
      },
    )

  const body = await request.json()

  const validated = await schema.safeParseAsync({
    name: body.name,
    description: body.description,
    isPublished: body.isPublished,
    locations: body.locations,
  })

  if (!validated.success)
    return Response.json(
      {
        errors: z.flattenError(validated.error).fieldErrors,
      },
      {
        status: 400,
      },
    )

  const updateData: Partial<Map> = {}

  if (validated.data.locations && validated.data.locations.length > 0) {
    const oldLocs = await db
      .select()
      .from(locationsTable)
      .where(eq(locationsTable.mapId, mapData.id))

    const newLocs = validated.data.locations

    const adding = newLocs.filter((n) =>
      oldLocs.every((o) => o.panoId !== n.panoId),
    )
    const updating = newLocs.filter((n) =>
      oldLocs.some(
        (o) =>
          o.panoId === n.panoId &&
          (o.heading !== n.heading || o.pitch !== n.pitch || o.zoom !== n.zoom),
      ),
    )
    const removing = oldLocs.filter((o) =>
      newLocs.every((n) => n.panoId !== o.panoId),
    )

    if (removing.length > 0) {
      await db.delete(locationsTable).where(
        and(
          eq(locationsTable.mapId, mapData.id),
          inArray(
            locationsTable.panoId,
            removing.map((loc) => loc.panoId),
          ),
        ),
      )
    }

    if (adding.length > 0) {
      await db.insert(locationsTable).values(
        adding.map((loc) => ({
          mapId: mapData.id,
          userId: user.id,
          streakLocationCode: getCountryFromCoordinates({
            lat: loc.lat,
            lng: loc.lng,
          }),
          lat: loc.lat,
          lng: loc.lng,
          heading: loc.heading ?? 0,
          panoId: loc.panoId,
          pitch: loc.pitch,
          zoom: loc.zoom,
        })),
      )
    }

    if (updating.length > 0) {
      const keysToUpdate = ['lat', 'lng', 'heading', 'pitch', 'zoom'] as const
      type Key = (typeof keysToUpdate)[number]

      const sqlChunks = Object.fromEntries(
        keysToUpdate.map((key) => [key, [sql`(case`]]),
      ) as Record<Key, SQL[]>

      const ids: string[] = []

      for (const input of updating) {
        ids.push(input.panoId)

        for (const key of keysToUpdate) {
          sqlChunks[key].push(
            sql`when ${locationsTable.panoId} = ${input.panoId} then ${input[key]}`,
          )
        }
      }

      const finalSql = Object.fromEntries(
        keysToUpdate.map((key) => {
          const finalChunks = [...sqlChunks[key], sql`end)`]
          return [key, sql.join(finalChunks, sql.raw(' '))]
        }),
      ) as Record<Key, SQL>

      await db
        .update(locationsTable)
        .set(finalSql)
        .where(inArray(locationsTable.panoId, ids))
    }

    const updatedLocs = await db
      .select()
      .from(locationsTable)
      .where(eq(locationsTable.mapId, mapData.id))

    const bounds =
      updatedLocs.length > 0
        ? calculateMapBounds(
            updatedLocs.map((loc) => ({
              lat: loc.lat,
              lng: loc.lng,
            })),
          )
        : {
            min: { lat: 0, lng: 0 },
            max: { lat: 0, lng: 0 },
          }

    const scoreFactor = calculateScoreFactor(bounds)

    updateData.bounds = bounds
    updateData.locationsCount = updatedLocs.length
    updateData.scoreFactor = scoreFactor
  }

  if (validated.data.isPublished !== undefined)
    updateData.isPublished = validated.data.isPublished

  if (validated.data.name) updateData.name = validated.data.name

  if (typeof validated.data.description === 'string')
    updateData.description =
      validated.data.description === '' ? null : validated.data.description

  updateData.updatedAt = new Date()

  const [updatedData] = await db
    .update(mapsTable)
    .set(updateData)
    .where(eq(mapsTable.id, mapData.id))
    .returning()

  return Response.json({
    data: camelCaseToSnakeCase<APIMap>({
      ...updatedData,
      createdAt: updatedData.createdAt.toISOString(),
      updatedAt: updatedData.updatedAt.toISOString(),
    }),
    message: 'Map updated successfully',
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

  const mapResult = await db
    .select()
    .from(mapsTable)
    .where(eq(mapsTable.id, params.id))

  const mapData = mapResult[0] ?? null

  if (mapData === null)
    return Response.json(
      {
        errors: {
          message: 'Map Not Found',
        },
      },
      {
        status: 404,
      },
    )

  if (mapData.creator !== user.id)
    return Response.json(
      {
        errors: {
          message: 'This map is not your map.',
        },
      },
      {
        status: 401,
      },
    )

  if (mapData.type === 'official') {
    if (user.role !== 'admin')
      return Response.json(
        {
          errors: {
            message: 'You cannot delete the official map.',
          },
        },
        {
          status: 401,
        },
      )

    return Response.json(
      {
        errors: {
          message: 'The official map cannot be deleted.',
        },
      },
      {
        status: 500,
      },
    )
  }

  await db.delete(mapsTable).where(eq(mapsTable.id, mapData.id))

  return Response.json({
    data: true,
  })
}
