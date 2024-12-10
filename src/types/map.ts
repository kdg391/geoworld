type MapType = 'community' | 'official'

export interface APIMap {
  id: string
  created_at: string
  updated_at: string
  type: MapType
  name: string
  description: string | null
  creator: string
  is_published: boolean
  average_score: number
  explorers_count: number
  locations_count: number
  likes_count: number
  score_factor: number
  bounds: {
    min: google.maps.LatLngLiteral
    max: google.maps.LatLngLiteral
  } | null
  country_code: string | null
}

export interface Map {
  id: string
  createdAt: Date
  updatedAt: Date
  type: MapType
  name: string
  description: string | null
  creator: string
  isPublished: boolean
  averageScore: number
  explorersCount: number
  locationsCount: number
  likesCount: number
  scoreFactor: number
  bounds: {
    min: google.maps.LatLngLiteral
    max: google.maps.LatLngLiteral
  } | null
  countryCode: string | null
}
