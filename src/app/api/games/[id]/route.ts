import { z } from 'zod'

import { getCurrentSession } from '@/lib/session.js'

import { calculateDistance, calculateRoundScore } from '@/utils/game.js'

import { createClient } from '@/utils/supabase/server.js'

import type { APIGame } from '@/types/game.js'
import type { APIMap } from '@/types/map.js'

export const GET = async (
  _: Request,
  segmentData: { params: Promise<{ id: string }> },
) => {
  const { session } = await getCurrentSession()

  const supabase = createClient({
    supabaseAccessToken: session?.supabaseAccessToken,
  })

  const params = await segmentData.params

  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', params.id)
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

  if (!data)
    return Response.json(
      {
        errors: {
          message: 'Game Not Found',
        },
      },
      {
        status: 404,
      },
    )

  return Response.json({
    data,
  })
}

const bodySchema = z.object({
  guessedLocation: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .nullable(),
  timedOut: z.boolean(),
})

export const PUT = async (
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

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const params = await segmentData.params

  const { data: gameData, error: gErr } = await supabase
    .from('games')
    .select('*')
    .eq('id', params.id)
    .single<APIGame>()

  if (gErr)
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

  if (gameData.user_id !== user.id)
    return Response.json(
      {
        errors: {
          message: 'This game is not your game.',
        },
      },
      {
        status: 401,
      },
    )

  if (gameData.state === 'finished')
    return Response.json(
      {
        errors: {
          message: 'This game is finished.',
        },
      },
      {
        status: 500,
      },
    )

  const { data: mapData, error: mErr } = await supabase
    .from('maps')
    .select('*')
    .eq('id', gameData.map_id)
    .single<APIMap>()

  if (mErr)
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

  const body = await request.json()

  const validated = await bodySchema.safeParseAsync(body)

  if (!validated.success)
    return Response.json(
      {
        errors: validated.error.flatten().fieldErrors,
      },
      {
        status: 400,
      },
    )

  const updateData: Partial<APIGame> = {}

  const isFinalRound = gameData.round === gameData.settings.rounds - 1

  const distance = {
    imperial: validated.data.guessedLocation
      ? calculateDistance(
          validated.data.guessedLocation,
          gameData.rounds[gameData.round],
          'imperial',
        )
      : 0,
    metric: validated.data.guessedLocation
      ? calculateDistance(
          validated.data.guessedLocation,
          gameData.rounds[gameData.round],
          'metric',
        )
      : 0,
  }

  const timedOutWithGuess =
    validated.data.timedOut && validated.data.guessedLocation !== null

  const score =
    validated.data.timedOut && validated.data.guessedLocation === null
      ? 0
      : calculateRoundScore(distance.metric, mapData.score_factor)

  const now = new Date()

  const time = validated.data.timedOut
    ? gameData.settings.time_limit
    : Math.floor(
        (now.getTime() -
          new Date(gameData.rounds[gameData.round].started_at).getTime()) /
          1000,
      )

  const rounds = [...gameData.rounds]

  rounds[gameData.round] = {
    ...rounds[gameData.round],
    ended_at: now.toISOString(),
  }

  updateData.rounds = rounds
  updateData.guesses = [
    ...gameData.guesses,
    {
      distance,
      position: validated.data.guessedLocation,
      score,
      time,
      timed_out: validated.data.timedOut,
      timed_out_with_guess: timedOutWithGuess,
    },
  ]
  updateData.total_score = gameData.total_score + score
  updateData.total_time = gameData.total_time + time
  updateData.state = isFinalRound ? 'finished' : 'started'

  const { data: updatedData, error: updatedErr } = await supabase
    .from('games')
    .update<Partial<APIGame>>(updateData)
    .eq('id', params.id)
    .select()
    .single<APIGame>()

  if (updatedErr)
    return Response.json(
      {
        errors: {
          message: 'Something went wrong!',
        },
      },
      {
        status: 500,
      },
    )

  return Response.json({
    data: updatedData,
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

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const params = await segmentData.params

  const { data: gameData, error: gErr } = await supabase
    .from('games')
    .select('*')
    .eq('id', params.id)
    .single<APIGame>()

  if (gErr)
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

  if (gameData.user_id !== user.id)
    return Response.json(
      {
        errors: {
          message: 'This game is not your game.',
        },
      },
      {
        status: 401,
      },
    )

  const { error: deletedErr } = await supabase
    .from('games')
    .delete()
    .eq('id', params.id)

  if (deletedErr)
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
    data: true,
  })
}
