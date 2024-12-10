import type { APIRoundLocation, RoundLocation } from './location.js'

export interface APIControlSettings {
  can_move: boolean
  can_pan: boolean
  can_zooom: boolean
}

export interface ControlSettings {
  canMove: boolean
  canPan: boolean
  canZoom: boolean
}

export interface APIRoundSettings {
  rounds: number
  time_limit: number
}

export interface RoundSettings {
  rounds: number
  timeLimit: number
}

export type APIGameSettings = APIControlSettings & APIRoundSettings
export type GameSettings = ControlSettings & RoundSettings

export interface APIGuess {
  distance: {
    imperial: number
    metric: number
  }
  position: google.maps.LatLngLiteral | null
  score: number
  time: number
  timed_out: boolean
  timed_out_with_guess: boolean
}

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

export type GameView = 'game' | 'result' | 'finalResult'

type GameState = 'started' | 'finished'
type GameMode = 'standard' | 'streak'

export interface APIGame {
  id: string
  created_at: string
  guesses: APIGuess[]
  map_id: string
  mode: GameMode
  round: number
  rounds: APIRoundLocation[]
  settings: APIGameSettings
  state: GameState
  total_score: number
  total_time: number
  user_id: string
}

export interface Game {
  id: string
  createdAt: Date
  guesses: Guess[]
  mapId: string
  mode: GameMode
  round: number
  rounds: RoundLocation[]
  settings: GameSettings
  state: GameState
  totalScore: number
  totalTime: number
  userId: string
}
