import type { SUPPORTED_LOCALES } from '../constants/i18n.js'
import type { OFFICIAL_COUNTRY_CODES } from '../constants/index.js'

export type Locales = (typeof SUPPORTED_LOCALES)[number]

export type LightDark = 'light' | 'dark'
export type Theme = LightDark | 'system'

export type DistanceUnit = 'imperial' | 'metric'

export type CountryCodes = (typeof OFFICIAL_COUNTRY_CODES)[number] | 'world'
