export type APILocation = {
  id: string
  created_at: string
  map_id: string
  user_id: string
  streak_location_code: string | null
} & APICoords

export type Location = {
  id: string
  createdAt: Date
  mapId: string
  userId: string
  streakLocationCode: string | null
} & Coords

export interface APICoords {
  lat: number
  lng: number
  heading: number
  pitch: number
  zoom: number
  pano_id: string
}

export interface Coords {
  lat: number
  lng: number
  heading: number
  pitch: number
  zoom: number
  panoId: string
}

export type APIRoundLocation = {
  streak_location_code: string | null
  started_at: string
  ended_at: string | null
} & APICoords

export type RoundLocation = {
  streakLocationCode: string | null
  startedAt: Date
  endedAt: Date | null
} & Coords
