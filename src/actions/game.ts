'use server'

import { cookies } from 'next/headers'

import { getCurrentSession } from '../session.js'

import { OFFICIAL_MAP_WORLD_ID } from '../constants/index.js'

import { snakeCaseToCamelCase } from '../utils/index.js'
import { createClient } from '../utils/supabase/server.js'

import type { APIGame, Game, GameSettings } from '../types/game.js'
import type { APILocation, APIRoundLocation } from '@/types/location.js'
import type { APIMap } from '../types/map.js'

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

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data: gameData, error: gErr } = await supabase
    .from('games')
    .select('*')
    .eq('id', id)
    .single<APIGame>()

  if (!gameData)
    return {
      data: null,
      errors: {
        message: 'Failed to load the game',
      },
    }

  if (gErr)
    return {
      data: null,
      errors: {
        message: 'Database Error',
      },
    }

  if (gameData.user_id !== user.id)
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

  const { data: mapData, error: mErr } = await supabase
    .from('maps')
    .select('*')
    .eq('id', gameData.map_id)
    .single<APIMap>()

  if (!mapData)
    return {
      data: null,
      errors: {
        message: 'Failed to load the map',
      },
    }

  if (mErr)
    return {
      data: null,
      errors: {
        message: 'Database Error',
      },
    }

  const isFinalRound = gameData.round === gameData.settings.rounds - 1

  if (!isFinalRound && gameData.rounds.length === gameData.guesses.length) {
    let location: APILocation

    do {
      const { data: lData, error: lErr } = await supabase
        .rpc('get_random_locations', {
          p_map_id: mapData.id === OFFICIAL_MAP_WORLD_ID ? null : mapData.id,
          p_count: 1,
        })
        .select('*')
        .single<APILocation>()

      if (!lData)
        return {
          data: null,
          errors: {
            message: 'Failed to load the location',
          },
        }

      if (lErr)
        return {
          data: null,
          errors: {
            message: 'Database Error',
          },
        }

      location = lData
    } while (
      gameData.rounds.find((r) => r.pano_id === location.pano_id) !== undefined
    )

    const actualLocation: APIRoundLocation = {
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

    const updateData: Partial<APIGame> = {}

    updateData.round = isFinalRound ? gameData.round : gameData.round + 1
    updateData.rounds = [...gameData.rounds, actualLocation]

    const { data: updatedData, error: updatedErr } = await supabase
      .from('games')
      .update<Partial<APIGame>>(updateData)
      .eq('id', id)
      .select()
      .single<APIGame>()

    if (updatedErr)
      return {
        data: null,
        errors: {
          message: 'Database Error',
        },
      }

    return {
      data: updatedData
        ? ({
            ...snakeCaseToCamelCase<Game>(updatedData),
            rounds: updatedData.rounds.map((r) => ({
              heading: r.heading,
              lat: r.lat,
              lng: r.lng,
              panoId: r.pano_id,
              streakLocationCode: r.streak_location_code,
              pitch: r.pitch,
              zoom: r.zoom,
              startedAt: new Date(r.started_at),
              endedAt: r.ended_at ? new Date(r.ended_at) : null,
            })),
          } as Game)
        : null,
      errors: null,
    }
  }

  return {
    data: gameData
      ? ({
          ...snakeCaseToCamelCase<Game>(gameData),
          rounds: gameData.rounds.map((r) => ({
            heading: r.heading,
            lat: r.lat,
            lng: r.lng,
            panoId: r.pano_id,
            streakLocationCode: r.streak_location_code,
            pitch: r.pitch,
            zoom: r.zoom,
            startedAt: new Date(r.started_at),
            endedAt: r.ended_at ? new Date(r.ended_at) : null,
          })),
        } as Game)
      : null,
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
            heading: r.heading,
            lat: r.lat,
            lng: r.lng,
            panoId: r.pano_id,
            streakLocationCode: r.streak_location_code,
            pitch: r.pitch,
            zoom: r.zoom,
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
            heading: r.heading,
            lat: r.lat,
            lng: r.lng,
            panoId: r.pano_id,
            streakLocationCode: r.streak_location_code,
            pitch: r.pitch,
            zoom: r.zoom,
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
  timedOut: boolean
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
      timedOut?: string[]
      message?: string
    }
  }

  return {
    data: data
      ? ({
          ...snakeCaseToCamelCase<Game>(data),
          rounds: data.rounds.map((r) => ({
            heading: r.heading,
            lat: r.lat,
            lng: r.lng,
            panoId: r.pano_id,
            streakLocationCode: r.streak_location_code,
            pitch: r.pitch,
            zoom: r.zoom,
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
