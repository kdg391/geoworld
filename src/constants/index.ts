export const ONE_DAY = 60 * 60 * 24

// game
export const MAX_ROUNDS = 10
export const DEFAULT_ROUNDS = 5

// map
export const COMMUNITY_MAP_MAX_LOCATIONS = 100

export const DEFAULT_MAP_CENTER: google.maps.LatLngLiteral = {
  lat: 0,
  lng: 0,
}

export const OFFICIAL_COUNTRY_CODES = [
  'at', // Austria
  'au', // Austrailia
  'br', // Brazil
  'ca', // Canada
  'ch', // Switzerland
  'cl', // Chile
  'cn', // China
  'de', // Germany
  'dk', // Denmark
  'fi', // Finland
  'fr', // France
  'gb', // United Kingdom
  'hk', // Hong Kong
  'id', // Indonesia
  'it', // Italy
  'jp', // Japan
  'kh', // Cambodia
  'kr', // South Korea
  'mo', // Macau
  'my', // Malaysia
  'no', // Norway
  'pl', // Poland
  'se', // Sweden
  'sg', // Singapore
  'tw', // Taiwan
  'us', // United States
  'vn', // Vietnam
] as const

export const WORLD_EMOJI = '🌐'

export const FLAG_ENOJIS: Record<
  (typeof OFFICIAL_COUNTRY_CODES)[number],
  string
> = {
  at: '🇦🇹',
  au: '🇦🇺',
  br: '🇧🇷',
  ca: '🇨🇦',
  ch: '🇨🇭',
  cl: '🇨🇱',
  cn: '🇨🇳',
  de: '🇩🇪',
  dk: '🇩🇰',
  fi: '🇫🇮',
  fr: '🇫🇷',
  gb: '🇬🇧',
  hk: '🇭🇰',
  id: '🇮🇩',
  it: '🇮🇹',
  jp: '🇯🇵',
  kh: '🇰🇭',
  kr: '🇰🇷',
  mo: '🇲🇴',
  my: '🇲🇾',
  no: '🇳🇴',
  pl: '🇵🇱',
  se: '🇸🇪',
  sg: '🇸🇬',
  tw: '🇹🇼',
  us: '🇺🇸',
  vn: '🇻🇳',
}

export const OFFICIAL_MAP_WORLD_ID = '8c050dd2-d8da-41a9-a83a-d386d051afd3'

export const OFFICIAL_MAP_COUNTRY_CODES: Record<
  string,
  (typeof OFFICIAL_COUNTRY_CODES)[number]
> = {
  '0dff5609-91cc-4bef-9b29-4f36c73c5a06': 'at',
  '53665461-aa6e-4045-8d8a-f0f55b54b3fc': 'au',
  '7ce7a788-00ee-46ab-be08-a241d8959336': 'br',
  '2d795a95-55f6-422e-94da-ab932e20101f': 'ca',
  '907f2236-114a-4a9b-b231-603d97c94f11': 'ch',
  '14b64e7b-77ae-4355-a700-a3ea392816fa': 'cl',
  'c548626a-a4c0-4b76-9431-e7966c16ff5e': 'cn',
  '315cc0d0-a456-4f15-ad8a-491bab56be1f': 'de',
  '440bc7f1-b6e4-4667-ba16-cb0382484903': 'dk',
  '14bb01e9-8725-4ac5-a835-0a7a120c960d': 'fi',
  'c311ae84-f897-48e7-bf25-3189811e51e8': 'fr',
  '4a779607-3ed6-487c-8331-0624cee83874': 'gb',
  'c7491504-7daf-4200-bd96-0cb43934fa1f': 'hk',
  '31ca7eec-53e2-4a75-ae10-0f7cc6219541': 'id',
  '646d9a6c-6bd0-4b85-9881-b8cb69a7f3c7': 'it',
  '82f85bac-dfb0-4d54-bd65-6b7abd9de027': 'jp',
  '90d1fef4-eaed-429b-8af0-f161d98acbb1': 'kh',
  '3e91889b-b04a-48ab-abed-035aad71a75c': 'kr',
  'fa5b7a28-bcba-4fc7-9526-6a5355cad8cf': 'mo',
  '366cdc87-9f50-4648-86e8-b5564ce1744f': 'my',
  '56852ba0-bff8-4731-ad6b-8d89abe9e0ac': 'no',
  'afd0e5d1-6fc0-4621-97c1-3c92f4ff9930': 'pl',
  '9deee185-bf34-4784-a9dc-3cc6e8704e19': 'se',
  'c5c8fafc-ae48-47f0-ac1d-6fe04be77c28': 'sg',
  'd752941f-d48e-49bd-b437-4866ccbd753d': 'tw',
  '7e22fca3-d235-4486-9cd7-85a8cf4eb6da': 'us',
  'b1b41f42-24f9-4f50-bff2-43f909c0b970': 'vn',
}
