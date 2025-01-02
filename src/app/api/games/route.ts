import { z } from 'zod'

import { OFFICIAL_MAP_WORLD_ID } from '@/constants/index.js'

import { getCurrentSession } from '@/lib/session.js'

import { createClient } from '@/utils/supabase/server.js'

import { gameSettingsSchema } from '@/utils/validations/game.js'

import type { APIGame } from '@/types/game.js'
import type { APIRoundLocation, Location } from '@/types/location'
import type { APIMap } from '@/types/map.js'

const mapIdSchema = z.object({
  mapId: z.string().uuid(),
})

const settingsSchema = z
  .object({
    rounds: z.number(),
    settings: gameSettingsSchema,
  })
  .superRefine(({ rounds, settings }, ctx) => {
    if (settings.rounds > rounds)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
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
        errors: validatedMap.error.flatten().fieldErrors,
      },
      {
        status: 401,
      },
    )

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data: mapData, error: mapErr } = await supabase
    .from('maps')
    .select('*')
    .eq('id', validatedMap.data.mapId)
    .maybeSingle<APIMap>()

  if (mapErr)
    return Response.json(
      {
        errors: {
          message: 'Database Error',
        },
      },
      {
        status: 500,
      },
    )

  if (!mapData)
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

  console.log(body.settings)

  const validated = await settingsSchema.safeParseAsync({
    rounds: mapData.locations_count,
    settings: body.settings,
  })

  if (!validated.success)
    return Response.json(
      {
        errors: validated.error.flatten().fieldErrors,
      },
      {
        status: 401,
      },
    )

  const { data: location, error: lErr } = await supabase
    .rpc('get_random_locations', {
      p_map_id: mapData.id === OFFICIAL_MAP_WORLD_ID ? null : mapData.id,
      p_count: 1,
    })
    .select('*')
    .single<Location>()

  if (lErr)
    return Response.json(
      {
        errors: {
          message: 'Database Error',
        },
      },
      {
        status: 500,
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

  const { data, error } = await supabase
    .from('games')
    .insert<Partial<APIGame>>({
      guesses: [],
      map_id: mapData.id,
      mode: 'standard',
      round: 0,
      rounds: [actualLocation],
      settings: {
        can_move: validated.data.settings.canMove,
        can_pan: validated.data.settings.canPan,
        can_zooom: validated.data.settings.canZoom,
        rounds: validated.data.settings.rounds,
        time_limit: validated.data.settings.timeLimit,
      },
      state: 'started',
      user_id: user.id,
    })
    .select()
    .single<APIGame>()

  if (error)
    return Response.json(
      {
        errors: {
          message: 'Database Error',
        },
      },
      {
        status: 500,
      },
    )

  return Response.json({
    data,
  })
}
