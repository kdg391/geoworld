'use server'

import { cookies } from 'next/headers'

import { auth } from '../auth.js'

import { OFFICIAL_MAP_WORLD_ID } from '../constants/index.js'

import { createClient } from '../utils/supabase/server.js'

import type {
  Game,
  GameSettings,
  Location,
  Map,
  RoundLocation,
} from '../types/index.js'

export const startGameRound = async (id: string) => {
  'use server'

  const session = await auth()

  if (!session)
    return {
      data: null,
      error: 'Unauthorized',
    }

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data: gameData, error: gErr } = await supabase
    .from('games')
    .select('*')
    .eq('id', id)
    .single<Game>()

  if (!gameData || gErr)
    return {
      data: null,
      error: gErr?.message ?? null,
    }

  if (gameData.user_id !== session.user.id)
    return {
      data: null,
      error: 'This game is not your game.',
    }

  if (gameData.state === 'finished')
    return {
      data: null,
      error: 'This game is finished.',
    }

  const { data: mapData, error: mErr } = await supabase
    .from('maps')
    .select('*')
    .eq('id', gameData.map_id)
    .single<Map>()

  if (!mapData || mErr)
    return {
      data: null,
      error: mErr?.message ?? null,
    }

  const isFinalRound = gameData.round === gameData.settings.rounds - 1

  if (!isFinalRound && gameData.rounds.length === gameData.guesses.length) {
    let location: Location

    do {
      const { data: lData, error: lErr } = await supabase
        .rpc('get_random_locations', {
          p_map_id: mapData.id === OFFICIAL_MAP_WORLD_ID ? null : mapData.id,
          p_count: 1,
        })
        .select('*')
        .single<Location>()

      if (!lData || lErr)
        return {
          data: null,
          error: lErr?.message ?? null,
        }

      location = lData
    } while (
      gameData.rounds.find((r) => r.pano_id === location.pano_id) !== undefined
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

    const updateData: Partial<Game> = {}

    updateData.round = isFinalRound ? gameData.round : gameData.round + 1
    updateData.rounds = [...gameData.rounds, actualLocation]

    const { data: updatedData, error: updatedErr } = await supabase
      .from('games')
      .update<Partial<Game>>(updateData)
      .eq('id', id)
      .select()
      .single<Game>()

    return {
      data: updatedData,
      error: updatedErr?.message ?? null,
    }
  }

  return {
    data: gameData,
    error: null,
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

  const data = await res.json()

  return data
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

  const data = await res.json()

  return data
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

  const data = await res.json()

  return data
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

  const data = await res.json()

  return data
}
