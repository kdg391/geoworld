import type { OFFICIAL_COUNTRY_CODES } from '../constants/index.js'
import type { SUPPORTED_LOCALES } from '../constants/i18n.js'

export type Locales = (typeof SUPPORTED_LOCALES)[number]

export type LightDark = 'light' | 'dark'
export type Theme = LightDark | 'system'

export type DistanceUnit = 'imperial' | 'metric'

export type CountryCodes = (typeof OFFICIAL_COUNTRY_CODES)[number] | 'world'

export type User = DefaultUser & {
  hashed_password: string | null
}

type UserRole = 'user' | 'admin' | 'guest'

export interface DefaultUser {
  id: string
  created_at: string
  email: string
  emailVerified: string | null
  role: UserRole
}

export interface Profile {
  id: string
  username: string | null
  display_name: string | null
  is_public: boolean
}

type MapType = 'community' | 'official'

export interface Map {
  id: string
  created_at: string
  updated_at: string
  type: MapType
  name: string
  description: string | null
  creator: string
  is_published: boolean
  average_score: number
  explorers: number
  locations_count: number
  likes_count: number
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

export interface Guess {
  distance: {
    imperial: number
    metric: number
  }
  position: google.maps.LatLngLiteral | null
  score: number
  time: number
  timedOut: boolean
  timedOutWithGuess: boolean
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
} & Coords

export type RoundLocation = Coords & {
  streak_location_code: string | null
  started_at: string
  ended_at: string | null
}

type GameState = 'started' | 'finished'
type GameMode = 'standard' | 'streak'

export type GameView = 'game' | 'result' | 'finalResult'

export interface Game {
  id: string
  bounds: {
    min: google.maps.LatLngLiteral
    max: google.maps.LatLngLiteral
  } | null
  guesses: Guess[]
  map_id: string
  mode: GameMode
  round: number
  rounds: RoundLocation[]
  settings: GameSettings
  state: GameState
  total_score: number
  total_time: number
  name: string
}
