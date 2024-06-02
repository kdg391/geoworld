import type { Codes } from '../utils/constants/index.js'

export type Theme = 'light' | 'dark' | 'system'

export type DistanceUnit = 'imperial' | 'metric'

export interface GameData {
    code: Codes | 'worldwide'
    locations: google.maps.LatLngLiteral[]
}
