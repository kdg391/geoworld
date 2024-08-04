'use server'

import { OFFICIAL_MAP_WORLD_ID } from '../constants/index.js'

import { calculateDistance, calculateRoundScore } from '../utils/game.js'

import { createClient } from '../utils/supabase/server.js'

import { gameSettingsValidation } from '../utils/validations/game.js'

import type { Game, GameSettings, Location, Map } from '../types/index.js'

export const createGame = async ({
  mapData,
  settings,
  userId,
}: {
  mapData: Map
  settings: GameSettings
  userId: string
}) => {
  'use server'

  const supabase = createClient()

  const settingsValidation = gameSettingsValidation(mapData.locations_count)
  const validated = await settingsValidation.safeParseAsync(settings)

  if (!validated.success)
    return {
      data: null,
      error: validated.error.flatten().fieldErrors,
    }

  const { data: locations, error: lErr } = await supabase
    .rpc('get_random_locations', {
      p_map_id: mapData.id === OFFICIAL_MAP_WORLD_ID ? null : mapData.id,
      p_count: settings.rounds,
    })
    .select('*')
    .returns<Location[]>()

  if (!locations || lErr)
    return {
      data: null,
      error: lErr?.message ?? null,
    }

  const { data, error } = await supabase
    .from('games')
    .insert<Omit<Game, 'id'>>({
      actual_locations: locations.map((loc) => ({
        lat: loc.lat,
        lng: loc.lng,
      })),
      guessed_locations: [],
      guessed_rounds: [],
      map_id: mapData.id,
      round: 0,
      settings,
      user_id: userId,
      state: 'started',
      mode: 'standard',
    })
    .select()
    .single<Game>()

  return {
    data,
    error: error?.message ?? null,
  }
}

export const getGame = async (id: string) => {
  'use server'

  const supabase = createClient()

  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', id)
    .single<Game>()

  return {
    data,
    error: error?.message ?? null,
  }
}

export const updateGame = async (
  id: string,
  data: {
    guessedLocation: google.maps.LatLngLiteral | null
    mapData: Map
    timedOut: boolean
  },
) => {
  'use server'

  const supabase = createClient()

  const { data: uData, error: uErr } = await supabase.auth.getUser()

  if (!uData.user || uErr)
    return {
      data: null,
      error: uErr?.message ?? null,
    }

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

  if (gameData.user_id !== uData.user.id)
    return {
      data: null,
      error: gErr,
    }

  const distance = {
    imperial: data.guessedLocation
      ? calculateDistance(
          data.guessedLocation,
          gameData.actual_locations[gameData.round],
          'imperial',
        )
      : 0,
    metric: data.guessedLocation
      ? calculateDistance(
          data.guessedLocation,
          gameData.actual_locations[gameData.round],
          'metric',
        )
      : 0,
  }

  const score =
    data.timedOut && !data.guessedLocation
      ? 0
      : calculateRoundScore(distance.metric, data.mapData.score_factor)

  const isFinalRound = gameData.round === gameData.settings.rounds - 1

  const { data: updatedData, error: updatedErr } = await supabase
    .from('games')
    .update<Partial<Game>>({
      round: isFinalRound ? gameData.round : gameData.round + 1,
      guessed_rounds: [
        ...gameData.guessed_rounds,
        {
          distance,
          points: score,
          timedOut: data.timedOut,
          timedOutWithGuess: data.timedOut && data.guessedLocation !== null,
        },
      ],
      guessed_locations: [...gameData.guessed_locations, data.guessedLocation],
      state: isFinalRound ? 'finished' : 'started',
    })
    .eq('id', id)
    .select()
    .single<Game>()

  return {
    data: updatedData,
    error: updatedErr?.message ?? null,
  }
}
