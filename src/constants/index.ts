export const ONE_DAY = 60 * 60 * 24

// game
export const MAX_ROUNDS = 10
export const DEFAULT_ROUNDS = 5

// map
export const COMMUNITY_MAP_MAX_LOCATIONS = 100

export const DEFAULT_MAP_OPTIONS: google.maps.MapOptions = {
  center: {
    lat: 0,
    lng: 0,
  },
}

export const OFFICIAL_COUNTRY_CODES = [
  'au', // Austrailia
  'ca', // Canada
  'cn', // China
  'de', // Germany
  'dk', // Denmark
  'fr', // France
  'gb', // United Kingdom
  'it', // Italy
  'jp', // Japan
  'kr', // South Korea
  'pl', // Poland
  'sg', // Singapore
  'tw', // Taiwan
  'us', // United States
] as const

export const WORLD_EMOJI = '🌐'

export const FLAG_ENOJIS: Record<
  (typeof OFFICIAL_COUNTRY_CODES)[number],
  string
> = {
  au: '🇦🇺',
  ca: '🇨🇦',
  cn: '🇨🇳',
  de: '🇩🇪',
  dk: '🇩🇰',
  fr: '🇫🇷',
  gb: '🇬🇧',
  it: '🇮🇹',
  jp: '🇯🇵',
  kr: '🇰🇷',
  pl: '🇵🇱',
  sg: '🇸🇬',
  tw: '🇹🇼',
  us: '🇺🇸',
}

export const OFFICIAL_MAP_WORLD_ID = '8c050dd2-d8da-41a9-a83a-d386d051afd3'

export const OFFICIAL_MAP_COUNTRY_CODES: Record<
  string,
  (typeof OFFICIAL_COUNTRY_CODES)[number]
> = {
  '53665461-aa6e-4045-8d8a-f0f55b54b3fc': 'au',
  '2d795a95-55f6-422e-94da-ab932e20101f': 'ca',
  'c548626a-a4c0-4b76-9431-e7966c16ff5e': 'cn',
  '315cc0d0-a456-4f15-ad8a-491bab56be1f': 'de',
  '440bc7f1-b6e4-4667-ba16-cb0382484903': 'dk',
  'c311ae84-f897-48e7-bf25-3189811e51e8': 'fr',
  'c7491504-7daf-4200-bd96-0cb43934fa1f': 'gb',
  '646d9a6c-6bd0-4b85-9881-b8cb69a7f3c7': 'it',
  '82f85bac-dfb0-4d54-bd65-6b7abd9de027': 'jp',
  '3e91889b-b04a-48ab-abed-035aad71a75c': 'kr',
  'afd0e5d1-6fc0-4621-97c1-3c92f4ff9930': 'pl',
  'c5c8fafc-ae48-47f0-ac1d-6fe04be77c28': 'sg',
  'd752941f-d48e-49bd-b437-4866ccbd753d': 'tw',
  '7e22fca3-d235-4486-9cd7-85a8cf4eb6da': 'us',
}

// locale
export const LANGUAGES = ['en', 'ko'] as const

export const LANGUAGE_NAMES = {
  en: 'English',
  ko: '한국어',
}

export const LANGUAGE_FLAGS = {
  en: FLAG_ENOJIS.us,
  ko: FLAG_ENOJIS.kr,
}
