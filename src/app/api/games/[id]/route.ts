import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '@/db/index.ts'
import { gamesTable, mapsTable } from '@/db/schema.ts'
import { getCurrentSession } from '@/lib/session.ts'
import { camelCaseToSnakeCase, snakeCaseToCamelCase } from '@/utils/casing.ts'
import { calculateDistance, calculateRoundScore } from '@/utils/game.ts'

import type {
  APIGame,
  ControlSettings,
  Game,
  Guess,
  RoundSettings,
} from '@/types/game.ts'
import type { RoundLocation } from '@/types/location.ts'

export const GET = async (
  _: Request,
  segmentData: { params: Promise<{ id: string }> },
) => {
  const params = await segmentData.params

  const result = await db
    .select()
    .from(gamesTable)
    .where(eq(gamesTable.id, params.id))

  const data = result[0] ?? null

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
    data: camelCaseToSnakeCase<APIGame>({
      ...data,
      createdAt: data.createdAt.toISOString(),
    }),
  })
}

const bodySchema = z.object({
  guessedLocation: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .nullable(),
  round: z.number(),
  streakLocationCode: z.string().optional(),
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

  const params = await segmentData.params

  const gameResult = await db
    .select()
    .from(gamesTable)
    .where(eq(gamesTable.id, params.id))

  const gameData = gameResult[0] ?? null

  if (gameData === null)
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

  if (gameData.userId !== user.id)
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

  const mapResult = await db
    .select()
    .from(mapsTable)
    .where(eq(mapsTable.id, gameData.mapId))

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

  const body = await request.json()

  const validated = await bodySchema.safeParseAsync(body)

  if (!validated.success)
    return Response.json(
      {
        errors: z.flattenError(validated.error).fieldErrors,
      },
      {
        status: 400,
      },
    )

  if (gameData.guesses.length === validated.data.round + 1)
    return Response.json(
      {
        errors: {
          message: 'You have already guessed this round.',
        },
      },
      {
        status: 400,
      },
    )

  const settings = snakeCaseToCamelCase<ControlSettings & RoundSettings>(
    gameData.settings,
  )

  const updateData: Partial<Game> = {}

  let isFinalRound = false

  if (gameData.mode === 'standard')
    isFinalRound = gameData.round === settings.rounds - 1

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
      : calculateRoundScore(distance.metric, mapData.scoreFactor)

  const now = new Date()

  const time = validated.data.timedOut
    ? settings.timeLimit
    : (now.getTime() - gameData.rounds[gameData.round].startedAt.getTime()) /
      1000

  const rounds = [...snakeCaseToCamelCase<RoundLocation[]>(gameData.rounds)]

  rounds[gameData.round] = {
    ...rounds[gameData.round],
    endedAt: now,
  }

  updateData.rounds = rounds
  updateData.guesses = [
    ...snakeCaseToCamelCase<Guess[]>(gameData.guesses),
    {
      distance,
      position: validated.data.guessedLocation,
      score,
      time,
      timedOut: validated.data.timedOut,
      timedOutWithGuess,
    },
  ]
  updateData.totalScore = gameData.totalScore + score
  updateData.totalTime = gameData.totalTime + time
  updateData.state = isFinalRound ? 'finished' : 'started'

  const [updatedData] = await db
    .update(gamesTable)
    .set({
      ...updateData,
      guesses: camelCaseToSnakeCase(updateData.guesses),
      settings: camelCaseToSnakeCase(updateData.settings),
      rounds: camelCaseToSnakeCase(
        updateData.rounds.map((r) => ({
          ...r,
          started_at: r.startedAt.toISOString(),
          ended_at: r.endedAt ? r.endedAt.toISOString() : null,
        })),
      ),
    })
    .where(eq(gamesTable.id, params.id))
    .returning()

  return Response.json({
    data: camelCaseToSnakeCase<APIGame>({
      ...updatedData,
      createdAt: updatedData.createdAt.toISOString(),
    }),
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

  const gameResult = await db
    .select()
    .from(gamesTable)
    .where(eq(gamesTable.id, params.id))

  const gameData = gameResult[0] ?? null

  if (!gameData)
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

  if (gameData.userId !== user.id)
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

  await db.delete(gamesTable).where(eq(gamesTable.id, params.id))

  return Response.json({
    data: true,
  })
}
