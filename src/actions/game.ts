'use server'

import { OFFICIAL_MAP_WORLD_ID } from '../constants/index.js'

import { calculateDistance, calculateRoundScore } from '../utils/game.js'
import { createClient } from '../utils/supabase/server.js'
import { getGameSettingsSchema } from '../utils/validations/game.js'

import type {
  Game,
  GameSettings,
  Location,
  Map,
  RoundLocation,
} from '../types/index.js'

export const startGameRound = async (id: string) => {
  'use server'

  const supabase = createClient()

  const { data: gameData, error: gErr } = await supabase
    .from('school_games')
    .select('*')
    .eq('id', id)
    .single<Game>()

  if (!gameData || gErr)
    return {
      data: null,
      error: gErr?.message ?? null,
    }

  if (gameData.state === 'finished')
    return {
      data: gameData,
      error: null,
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
      .from('school_games')
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

export const createGame = async ({
  mapData,
  settings,
  name,
}: {
  mapData: Map
  settings: GameSettings
  name: string
}) => {
  'use server'

  const supabase = createClient()

  const settingsSchema = getGameSettingsSchema(mapData.locations_count)
  const validated = await settingsSchema.safeParseAsync(settings)

  if (!validated.success)
    return {
      data: null,
      error: validated.error.flatten().fieldErrors,
    }

  const { data: location, error: lErr } = await supabase
    .rpc('get_random_locations', {
      p_map_id: mapData.id === OFFICIAL_MAP_WORLD_ID ? null : mapData.id,
      p_count: 1,
    })
    .select('*')
    .single<Location>()

  if (!location || lErr)
    return {
      data: null,
      error: lErr?.message ?? null,
    }

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
    .from('school_games')
    .insert<Partial<Game>>({
      bounds: null,
      guesses: [],
      map_id: mapData.id,
      mode: 'standard',
      round: 0,
      rounds: [actualLocation],
      settings,
      state: 'started',
      name,
    })
    .select()
    .single<Game>()

  return {
    data,
    error: error?.message ?? null,
  }
}

interface GuessData {
  guessedLocation: google.maps.LatLngLiteral | null
  timedOut: boolean
}

export const updateGame = async (id: string, data: GuessData) => {
  'use server'

  const supabase = createClient()

  const { data: gameData, error: gErr } = await supabase
    .from('school_games')
    .select('*')
    .eq('id', id)
    .single<Game>()

  if (!gameData || gErr)
    return {
      data: null,
      error: gErr?.message ?? null,
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

  const updateData: Partial<Game> = {}

  const isFinalRound = gameData.round === gameData.settings.rounds - 1

  const distance = {
    imperial: data.guessedLocation
      ? calculateDistance(
          data.guessedLocation,
          gameData.rounds[gameData.round],
          'imperial',
        )
      : 0,
    metric: data.guessedLocation
      ? calculateDistance(
          data.guessedLocation,
          gameData.rounds[gameData.round],
          'metric',
        )
      : 0,
  }

  const timedOutWithGuess = data.timedOut && data.guessedLocation !== null

  const score =
    data.timedOut && data.guessedLocation === null
      ? 0
      : calculateRoundScore(distance.metric, mapData.score_factor)

  const now = new Date()

  const time = data.timedOut
    ? gameData.settings.timeLimit
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
      position: data.guessedLocation,
      score,
      time,
      timedOut: data.timedOut,
      timedOutWithGuess,
    },
  ]
  updateData.total_score = gameData.total_score + score
  updateData.total_time = gameData.total_time + time
  updateData.state = isFinalRound ? 'finished' : 'started'

  const { data: updatedData, error: updatedErr } = await supabase
    .from('school_games')
    .update<Partial<Game>>(updateData)
    .eq('id', id)
    .select()
    .single<Game>()

  return {
    data: updatedData,
    error: updatedErr?.message ?? null,
  }
}

export const getSchoolRankedGames = async () => {
  const supabase = createClient()

  const { data, error } = await supabase
    .rpc('get_ranked_school_games', {
      p_map_id: OFFICIAL_MAP_WORLD_ID,
    })
    .select('*')

  return {
    data,
    error: error?.message ?? null,
  }
}
