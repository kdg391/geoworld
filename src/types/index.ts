import type { LANGUAGES, OFFICIAL_COUNTRY_CODES } from '../constants/index.js'

export type Locales = (typeof LANGUAGES)[number]

export type Theme = 'light' | 'dark' | 'system'

export type DistanceUnit = 'imperial' | 'metric'

export type CountryCodes = (typeof OFFICIAL_COUNTRY_CODES)[number] | 'world'

export type GameView = 'game' | 'result' | 'finalResult'

export interface GameData {
  code: CountryCodes
  locations: google.maps.LatLngLiteral[]
  rounds: number
  guessedLocations: (google.maps.LatLngLiteral | null)[]
}

export interface Profile {
  id: string
  display_name: string
  is_admin: boolean
  public: boolean
}

export interface Map {
  id: string
  created_at: string
  type: 'community' | 'official'
  name: string
  description: string | null
  creator: string
  public: boolean
  locations_count: number
  score_factor: number
  bounds: {
    min: google.maps.LatLngLiteral
    max: google.maps.LatLngLiteral
  }
}

export interface ControlSettings {
  canMove: boolean
  canPan: boolean
  canZoom: boolean
}

export interface Settings {
  rounds: number
  timeLimit: number | null
}

export type GameSettings = ControlSettings & Settings

export interface GuessedRound {
  distance: {
    imperial: number
    metric: number
  }
  points: number
  timedOut: boolean
  timedOutWithGuess: boolean
}

type GameState = 'started' | 'finished'
type GameMode = 'standard'

export interface Game {
  id: string
  map_id: string
  user_id: string
  actual_locations: google.maps.LatLngLiteral[]
  round: number
  guessed_locations: (google.maps.LatLngLiteral | null)[]
  guessed_rounds: GuessedRound[]
  settings: GameSettings
  state: GameState
  mode: GameMode
}

export interface Location {
  id: string
  map_id: string
  user_id: string
  lat: number
  lng: number
  heading: number
  pitch: number
  zoom: number
  pano_id: string
  streak_location_code?: string
}
