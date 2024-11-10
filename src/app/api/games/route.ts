import { z } from 'zod'

import { auth } from '@/auth.js'

import { OFFICIAL_MAP_WORLD_ID } from '@/constants/index.js'

import { createClient } from '@/utils/supabase/server.js'

import { gameSettingsSchema } from '@/utils/validations/game.js'

import type { Game, Location, Map, RoundLocation } from '@/types/index.js'

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
  const session = await auth()

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

  const validatedMapId = await mapIdSchema.safeParseAsync({
    mapId: body.mapId,
  })

  if (!validatedMapId.success)
    return Response.json(
      {
        errors: validatedMapId.error.flatten().fieldErrors,
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
    .eq('id', validatedMapId.data.mapId)
    .single<Map>()

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

  const actualLocation: RoundLocation = {
    lat: location.lat,
    lng: location.lng,
    heading: location.heading,
    pitch: location.pitch,
    zoom: location.zoom,
    pano_id: location.pano_id,
    streak_location_code: location.streak_location_code,
    started_at: new Date().toISOString(),
    ended_at: null,
  }

  const { data, error } = await supabase
    .from('games')
    .insert<Partial<Game>>({
      guesses: [],
      map_id: mapData.id,
      mode: 'standard',
      round: 0,
      rounds: [actualLocation],
      settings: validated.data.settings,
      state: 'started',
      user_id: session.user.id,
    })
    .select()
    .single<Game>()

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
