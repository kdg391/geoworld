'use server'

import { and, asc, desc, eq, sql } from 'drizzle-orm'
import { cookies } from 'next/headers'

import { OFFICIAL_MAP_WORLD_ID } from '../constants/index.ts'
import { db } from '../db/index.ts'
import { gamesTable, mapsTable, profilesTable } from '../db/schema.ts'
import { getCurrentSession } from '../lib/session.ts'
import { snakeCaseToCamelCase } from '../utils/casing.ts'

import { getRandomLocations } from './location.ts'

import type { APIGame, Game, GameSettings } from '../types/game.ts'
import type { Location, RoundLocation } from '../types/location.ts'

export const startGameRound = async (id: string) => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session)
    return {
      data: null,
      errors: {
        message: 'Unauthorized',
      },
    }

  const gameResult = await db
    .select()
    .from(gamesTable)
    .where(eq(gamesTable.id, id))

  const gameData = gameResult[0] ?? null

  if (gameData === null)
    return {
      data: null,
      errors: {
        message: 'Failed to load the game',
      },
    }

  if (gameData.userId !== user.id)
    return {
      data: null,
      errors: {
        message: 'This game is not your game.',
      },
    }

  if (gameData.state === 'finished')
    return {
      data: null,
      errors: {
        message: 'This game is finished.',
      },
    }

  const mapsResult = await db
    .select()
    .from(mapsTable)
    .where(eq(mapsTable.id, gameData.mapId))

  const mapData = mapsResult[0] ?? null

  if (!mapData)
    return {
      data: null,
      errors: {
        message: 'Failed to load the map',
      },
    }

  const isFinalRound = gameData.round === gameData.settings.rounds - 1

  if (!isFinalRound && gameData.rounds.length === gameData.guesses.length) {
    let location: Omit<Location, 'id'>

    do {
      const loc = await getRandomLocations({
        mapId: mapData.id === OFFICIAL_MAP_WORLD_ID ? null : mapData.id,
        count: 1,
      })

      if (!loc)
        return {
          data: null,
          errors: {
            message: 'Failed to load the location',
          },
        }

      location = loc
    } while (
      gameData.rounds.find((r) => r.panoId === location.panoId) !== undefined
    )

    const actualLocation: RoundLocation = {
      lat: location.lat,
      lng: location.lng,
      heading: location.heading,
      pitch: location.pitch,
      zoom: location.zoom,
      panoId: location.panoId,
      streakLocationCode: location.streakLocationCode,
      startedAt: new Date(),
      endedAt: null,
    }

    const updateData: Partial<Game> = {}

    updateData.round = isFinalRound ? gameData.round : gameData.round + 1
    updateData.rounds = [...gameData.rounds, actualLocation]

    const [updatedData] = await db
      .update(gamesTable)
      .set(updateData)
      .where(eq(gamesTable.id, id))
      .returning()

    return {
      data: updatedData,
      errors: null,
    }
  }

  return {
    data: gameData,
    errors: null,
  }
}

export const getGame = async (id: string) => {
  'use server'

  const cookieStore = await cookies()

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/games/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieStore.toString(),
    },
  })

  const { data, errors } = (await res.json()) as {
    data?: APIGame
    errors?: {
      message: string
    }
  }

  return {
    data: data
      ? ({
          ...snakeCaseToCamelCase<Game>(data),
          rounds: data.rounds.map((r) => ({
            ...snakeCaseToCamelCase<RoundLocation>(r),
            startedAt: new Date(r.started_at),
            endedAt: r.ended_at ? new Date(r.ended_at) : null,
          })),
        } as Game)
      : null,
    errors: errors ?? null,
  }
}

export const createGame = async (payload: {
  mapId: string
  settings: GameSettings
}) => {
  'use server'

  const cookieStore = await cookies()

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/games`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify(payload),
  })

  const { data, errors } = (await res.json()) as {
    data?: APIGame
    errors?: {
      mapId?: string[]
      message?: string
      rounds?: string[]
      settings?: string[]
    }
  }

  return {
    data: data
      ? ({
          ...snakeCaseToCamelCase<Game>(data),
          rounds: data.rounds.map((r) => ({
            ...snakeCaseToCamelCase<RoundLocation>(r),
            startedAt: new Date(r.started_at),
            endedAt: r.ended_at ? new Date(r.ended_at) : null,
          })),
        } as Game)
      : null,
    errors: errors ?? null,
  }
}

interface GuessData {
  guessedLocation: google.maps.LatLngLiteral | null
  round: number
  timedOut: boolean
  streakLocationCode?: string
}

export const updateGame = async (id: string, payload: GuessData) => {
  'use server'

  const cookieStore = await cookies()

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/games/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify(payload),
  })

  const { data, errors } = (await res.json()) as {
    data?: APIGame
    errors?: {
      guessedLocation?: string[]
      round?: string[]
      timedOut?: string[]
      streakLocationCode?: string[]
      message?: string
    }
  }

  return {
    data: data
      ? ({
          ...snakeCaseToCamelCase<Game>(data),
          rounds: data.rounds.map((r) => ({
            ...snakeCaseToCamelCase<RoundLocation>(r),
            startedAt: new Date(r.started_at),
            endedAt: r.ended_at ? new Date(r.ended_at) : null,
          })),
        } as Game)
      : null,
    errors: errors ?? null,
  }
}

export const deleteGame = async (id: string) => {
  'use server'

  const cookieStore = await cookies()

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/games/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieStore.toString(),
    },
  })

  const { data, errors } = (await res.json()) as {
    data?: boolean
    errors?: {
      message: string
    }
  }

  return {
    data: data ?? false,
    errors: errors ?? null,
  }
}

/*
create or replace function geoworld.get_ranked_games(p_map_id uuid)
returns table (
  id uuid,
  user_id uuid,
  map_id uuid,
  guesses jsonb,
  total_score int4,
  total_time int4,
  display_name text,
  rank bigint
)
security definer set search_path = ''
AS $$
BEGIN
  return query
  with
    ranks AS (
      select DISTINCT ON (g.user_id)
        g.id,
        g.user_id,
        g.map_id,
        g.guesses,
        g.total_score,
        g.total_time,
        p.display_name
      from
        geoworld.games g
        INNER JOIN geoworld.profiles p ON g.user_id = p.id
      where
        g.map_id = p_map_id
        and g.state = 'finished'
        and (g.settings ->> 'rounds')::int = 5
        and (g.settings ->> 'can_pan')::boolean = true
        and (g.settings ->> 'can_zoom')::boolean = true
        and (g.settings ->> 'can_move')::boolean = true
        and (g.settings ->> 'time_limit')::int = 0
      ORDER BY g.user_id, g.total_score DESC, g.total_time ASC
    )
  select
    r.*,
    ROW_NUMBER() OVER (ORDER BY r.total_score DESC, r.total_time ASC) AS rank
  from
    ranks r
  order by rank
  limit 10;
END;
$$ LANGUAGE plpgsql;
*/
export const getRankedGames = async ({
  mapId,
  count = 10,
}: {
  mapId: string
  count: number
}) => {
  const ranksSubquery = db
    .selectDistinctOn([gamesTable.userId], {
      id: gamesTable.id,
      userId: gamesTable.userId,
      mapId: gamesTable.mapId,
      guesses: gamesTable.guesses,
      totalScore: gamesTable.totalScore,
      totalTime: gamesTable.totalTime,
      displayName: profilesTable.displayName,
    })
    .from(gamesTable)
    .innerJoin(profilesTable, eq(gamesTable.userId, profilesTable.id))
    .where(
      and(
        eq(gamesTable.mapId, mapId),
        eq(gamesTable.state, 'finished'),
        sql`(${gamesTable.settings}->>'rounds')::int = 5`,
        sql`(${gamesTable.settings}->>'can_pan')::boolean = true`,
        sql`(${gamesTable.settings}->>'can_zoom')::boolean = true`,
        sql`(${gamesTable.settings}->>'can_move')::boolean = true`,
        sql`(${gamesTable.settings}->>'time_limit')::int = 0`,
      ),
    )
    .orderBy(
      gamesTable.userId,
      desc(gamesTable.totalScore),
      asc(gamesTable.totalTime),
    )
    .as('ranks')

  const rankExpr = sql<number>`
    ROW_NUMBER() OVER (
      ORDER BY ${ranksSubquery.totalScore} DESC,
              ${ranksSubquery.totalTime} ASC
    )
  `.as('rank')

  const rankedGames = await db
    .select({
      id: ranksSubquery.id,
      userId: ranksSubquery.userId,
      mapId: ranksSubquery.mapId,
      guesses: ranksSubquery.guesses,
      totalScore: ranksSubquery.totalScore,
      totalTime: ranksSubquery.totalTime,
      displayName: ranksSubquery.displayName,
      rank: rankExpr,
    })
    .from(ranksSubquery)
    .orderBy(sql`"rank"`)
    .limit(count)

  return rankedGames
}
