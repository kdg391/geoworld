import type { FLAG_ENOJIS } from '../constants/index.js'

export type Theme = 'light' | 'dark' | 'system'

export type DistanceUnit = 'imperial' | 'metric'

export type CountryCodes = keyof typeof FLAG_ENOJIS | 'worldwide'

export interface GameData {
    code: CountryCodes
    locations: google.maps.LatLngLiteral[]
    rounds: number
    guessedLocations: (google.maps.LatLngLiteral | null)[]
}

export interface MapData {
    code: CountryCodes
    // type: 'official' | 'user'
    locations: google.maps.LatLngLiteral[]
}
