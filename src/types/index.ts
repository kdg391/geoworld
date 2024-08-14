import type { OFFICIAL_COUNTRY_CODES } from '../constants/index.js'
import type { SUPPORTED_LOCALES } from '../constants/i18n.js'

export type Locales = (typeof SUPPORTED_LOCALES)[number]

// todo: change name
export type LightDark = 'light' | 'dark'
export type Theme = LightDark | 'system'

export type DistanceUnit = 'imperial' | 'metric'

export type CountryCodes = (typeof OFFICIAL_COUNTRY_CODES)[number] | 'world'

export type GameView = 'game' | 'result' | 'finalResult'

export interface Profile {
  id: string
  username: string
  display_name: string
  is_admin: boolean
  is_public: boolean
}

export interface Map {
  id: string
  created_at: string
  updated_at: string
  type: 'community' | 'official'
  name: string
  description: string | null
  creator: string
  is_published: boolean
  average_score: number
  explorers: number
  locations_count: number
  likes: number
  score_factor: number
  bounds: {
    min: google.maps.LatLngLiteral
    max: google.maps.LatLngLiteral
  } | null
}

export interface ControlSettings {
  canMove: boolean
  canPan: boolean
  canZoom: boolean
}

export interface Settings {
  rounds: number
  timeLimit: number
}

export type GameSettings = ControlSettings & Settings

export interface GuessedRound {
  distance: {
    imperial: number
    metric: number
  }
  points: number
  time: number
  timedOut: boolean
  timedOutWithGuess: boolean
}

type GameState = 'started' | 'finished'
type GameMode = 'standard'

export interface Game {
  id: string
  map_id: string
  user_id: string
  rounds: (Coords & {
    streak_location_code: string | null
    started_at: string
  })[]
  round: number
  guessed_locations: (google.maps.LatLngLiteral | null)[]
  guessed_rounds: GuessedRound[]
  total_score: number
  total_time: number
  settings: GameSettings
  state: GameState
  mode: GameMode
}

export interface Coords {
  lat: number
  lng: number
  heading: number
  pitch: number
  zoom: number
  pano_id: string
}

export type Location = {
  id: string
  created_at: string
  map_id: string
  user_id: string
  streak_location_code: string | null
  started_at: string
} & Coords
