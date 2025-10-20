import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { getRandomLocations } from '@/actions/location.ts'
import { OFFICIAL_MAP_WORLD_ID } from '@/constants/index.ts'
import { db } from '@/db/index.ts'
import { gamesTable, mapsTable } from '@/db/schema.ts'
import { getCurrentSession } from '@/lib/session.ts'
import { camelCaseToSnakeCase } from '@/utils/casing.ts'
import { gameSettingsSchema } from '@/utils/validations/game.ts'

import type { APIGame } from '@/types/game.ts'
import type { APIRoundLocation } from '@/types/location.ts'

const mapIdSchema = z.object({
  mapId: z.uuid(),
})

const settingsSchema = z
  .object({
    rounds: z.number(),
    settings: gameSettingsSchema,
  })
  .superRefine(({ rounds, settings }, ctx) => {
    if (settings.rounds > rounds)
      ctx.addIssue({
        code: 'custom',
        message: `The game rounds cannot be more than ${rounds}.`,
        path: ['settings', 'rounds'],
      })
  })

export const POST = async (request: Request) => {
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

  const validatedMap = await mapIdSchema.safeParseAsync({
    mapId: body.mapId,
  })

  if (!validatedMap.success)
    return Response.json(
      {
        errors: z.flattenError(validatedMap.error).fieldErrors,
      },
      {
        status: 401,
      },
    )

  const mapResult = await db
    .select()
    .from(mapsTable)
    .where(eq(mapsTable.id, validatedMap.data.mapId))

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

  const validated = await settingsSchema.safeParseAsync({
    rounds: mapData.locationsCount,
    settings: body.settings,
  })

  if (!validated.success)
    return Response.json(
      {
        errors: z.flattenError(validated.error).fieldErrors,
      },
      {
        status: 401,
      },
    )

  const location = await getRandomLocations({
    mapId: mapData.id === OFFICIAL_MAP_WORLD_ID ? null : mapData.id,
    count: 1,
  })

  if (!location)
    return Response.json(
      {
        errors: {
          message: 'Location Not Found',
        },
      },
      {
        status: 404,
      },
    )

  const actualLocation: APIRoundLocation = {
    lat: location.lat,
    lng: location.lng,
    heading: location.heading,
    pitch: location.pitch,
    zoom: location.zoom,
    pano_id: location.panoId,
    streak_location_code: location.streakLocationCode,
    started_at: new Date().toISOString(),
    ended_at: null,
  }

  const [data] = await db
    .insert(gamesTable)
    .values({
      mode: 'standard',
      mapId: mapData.id,
      round: 0,
      rounds: [actualLocation],
      guesses: [],
      settings: {
        canMove: validated.data.settings.canMove,
        canPan: validated.data.settings.canPan,
        canZoom: validated.data.settings.canZoom,
        rounds: validated.data.settings.rounds,
        timeLimit: validated.data.settings.timeLimit,
      },
      state: 'started',
      userId: user.id,
    })
    .returning()

  return Response.json({
    data: camelCaseToSnakeCase<APIGame>({
      ...data,
      createdAt: data.createdAt.toISOString(),
    }),
  })
}
