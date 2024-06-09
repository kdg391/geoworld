import type { Codes } from '../constants/index.js'

export type Theme = 'light' | 'dark' | 'system'

export type DistanceUnit = 'imperial' | 'metric'

export interface GameData {
    code: Codes | 'worldwide'
    locations: google.maps.LatLngLiteral[]
}
