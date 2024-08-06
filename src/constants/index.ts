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
  'ar', // Argentina
  'at', // Austria
  'au', // Austrailia
  'be', // Belgium
  'bo', // Bolivia
  'br', // Brazil
  'ca', // Canada
  'ch', // Switzerland
  'cl', // Chile
  'cn', // China
  'co', // Colombia
  'cz', // Czech Republic
  'de', // Germany
  'dk', // Denmark
  'ee', // Estonia
  'es', // Spain
  'fi', // Finland
  'fr', // France
  'gb', // United Kingdom
  'gr', // Greece
  'gt', // Guatemala
  'hk', // Hong Kong
  'hr', // Croatia
  'hu', // Hungary
  'id', // Indonesia
  'in', // India
  'is', // Iceland
  'it', // Italy
  'jp', // Japan
  'ke', // Kenya
  'kh', // Cambodia
  'kr', // South Korea
  'lt', // Lithuania
  'mc', // Monaco
  'me', // Montenegro
  'mn', // Mongolia
  'mo', // Macau
  'mx', // Mexico
  'my', // Malaysia
  'no', // Norway
  'nz', // New Zealand
  'pe', // Peru
  'ph', // Philippines
  'pl', // Poland
  'pt', // Portugal
  'ro', // Romania
  'rs', // Serbia
  'se', // Sweden
  'sg', // Singapore
  'si', // Slovenia
  'sn', // Senegal
  'sk', // Slovakia
  'th', // Thailand
  'tr', // Turkey
  'tw', // Taiwan
  'ua', // Ukraine
  'us', // United States
  'uy', // Uruguay
  'vn', // Vietnam
  'za', // South Africa
] as const

export const WORLD_EMOJI = '🌐'

export const FLAG_ENOJIS: Record<
  (typeof OFFICIAL_COUNTRY_CODES)[number],
  string
> = {
  ar: '🇦🇷',
  at: '🇦🇹',
  au: '🇦🇺',
  be: '🇧🇪',
  bo: '🇧🇴',
  br: '🇧🇷',
  ca: '🇨🇦',
  ch: '🇨🇭',
  cl: '🇨🇱',
  cn: '🇨🇳',
  co: '🇨🇴',
  cz: '🇨🇿',
  de: '🇩🇪',
  dk: '🇩🇰',
  ee: '🇪🇪',
  es: '🇪🇸',
  fi: '🇫🇮',
  fr: '🇫🇷',
  gb: '🇬🇧',
  gr: '🇬🇷',
  gt: '🇬🇹',
  hk: '🇭🇰',
  hr: '🇭🇷',
  hu: '🇭🇺',
  id: '🇮🇩',
  in: '🇮🇳',
  is: '🇮🇸',
  it: '🇮🇹',
  jp: '🇯🇵',
  ke: '🇰🇪',
  kh: '🇰🇭',
  kr: '🇰🇷',
  lt: '🇱🇹',
  mc: '🇲🇨',
  me: '🇲🇪',
  mn: '🇲🇳',
  mo: '🇲🇴',
  mx: '🇲🇽',
  my: '🇲🇾',
  no: '🇳🇴',
  nz: '🇳🇿',
  pe: '🇵🇪',
  ph: '🇵🇭',
  pl: '🇵🇱',
  pt: '🇵🇹',
  ro: '🇷🇴',
  rs: '🇷🇸',
  se: '🇸🇪',
  sg: '🇸🇬',
  si: '🇸🇮',
  sk: '🇸🇰',
  sn: '🇸🇳',
  th: '🇹🇭',
  tr: '🇹🇷',
  tw: '🇹🇼',
  ua: '🇺🇦',
  us: '🇺🇸',
  uy: '🇺🇾',
  vn: '🇻🇳',
  za: '🇿🇦',
}

export const OFFICIAL_MAP_WORLD_ID = '8c050dd2-d8da-41a9-a83a-d386d051afd3'

export const OFFICIAL_MAP_COUNTRY_CODES: Record<
  string,
  (typeof OFFICIAL_COUNTRY_CODES)[number]
> = {
  '8f657fd9-7230-401a-8246-d9624539dcab': 'ar',
  '0dff5609-91cc-4bef-9b29-4f36c73c5a06': 'at',
  '53665461-aa6e-4045-8d8a-f0f55b54b3fc': 'au',
  '9720b80f-aa99-4653-9f96-a59deed8fef2': 'be',
  '2cb4895a-75f3-4617-b023-23c67f0ed332': 'bo',
  '7ce7a788-00ee-46ab-be08-a241d8959336': 'br',
  '2d795a95-55f6-422e-94da-ab932e20101f': 'ca',
  '907f2236-114a-4a9b-b231-603d97c94f11': 'ch',
  '14b64e7b-77ae-4355-a700-a3ea392816fa': 'cl',
  'c548626a-a4c0-4b76-9431-e7966c16ff5e': 'cn',
  '473149ad-a6a4-4281-bb42-75e998f68b6c': 'co',
  '8f394e48-4d75-476c-8b03-07d58798fce9': 'cz',
  '315cc0d0-a456-4f15-ad8a-491bab56be1f': 'de',
  '440bc7f1-b6e4-4667-ba16-cb0382484903': 'dk',
  '68b55f84-9e53-4f5f-824e-2ea185c78d06': 'ee',
  '0d8a6a60-b4e9-47f4-ab83-4d8f5651398d': 'es',
  '14bb01e9-8725-4ac5-a835-0a7a120c960d': 'fi',
  'c311ae84-f897-48e7-bf25-3189811e51e8': 'fr',
  '4a779607-3ed6-487c-8331-0624cee83874': 'gb',
  'ae2a23de-69b0-45ab-beae-2c536f19e30f': 'gt',
  'bace22f6-ea1a-4e16-b3ec-7b59c2892fa3': 'gr',
  'c7491504-7daf-4200-bd96-0cb43934fa1f': 'hk',
  '0d2ef220-1362-4d72-a12c-9eb7b8eb078e': 'hr',
  '34bbe5bb-ed54-4494-b433-f834b48f0db7': 'hu',
  '31ca7eec-53e2-4a75-ae10-0f7cc6219541': 'id',
  '5e275a5f-477d-4ff4-b916-b496cb60ff11': 'in',
  '47e6aba2-a008-4aa6-b808-4f98bcb0295e': 'is',
  '646d9a6c-6bd0-4b85-9881-b8cb69a7f3c7': 'it',
  '82f85bac-dfb0-4d54-bd65-6b7abd9de027': 'jp',
  '22e96b5c-522a-432a-ad13-93c75a10c66e': 'ke',
  '90d1fef4-eaed-429b-8af0-f161d98acbb1': 'kh',
  '3e91889b-b04a-48ab-abed-035aad71a75c': 'kr',
  '16698cf5-b562-48a3-9741-015438b97968': 'lt',
  '5eb209c8-c4dd-4d9e-acc4-2c957b89a65f': 'mc',
  'b7378695-3ee4-4a75-8d10-5a60a4ab4b18': 'me',
  '91ed1f28-0d6c-4853-a63c-d85082b5c913': 'mn',
  'fa5b7a28-bcba-4fc7-9526-6a5355cad8cf': 'mo',
  '54634743-007f-4970-8f68-2062c128dbcd': 'mx',
  '366cdc87-9f50-4648-86e8-b5564ce1744f': 'my',
  '56852ba0-bff8-4731-ad6b-8d89abe9e0ac': 'no',
  '0cce108b-98c8-4669-82a2-427ad095cd20': 'nz',
  'ea4b2235-0507-48e4-a97e-06b1aba8fa20': 'pe',
  '6bc97ec1-43f0-4247-9ba5-dd25cf25d43c': 'ph',
  'afd0e5d1-6fc0-4621-97c1-3c92f4ff9930': 'pl',
  'a9bd8f88-828c-4296-8c92-9d689e224907': 'pt',
  '4ddfbc5f-cdca-49dc-b684-f93dec9cf63b': 'ro',
  'b40ba73a-cd9e-4dbb-8f57-f05c15e27e59': 'rs',
  '9deee185-bf34-4784-a9dc-3cc6e8704e19': 'se',
  'c5c8fafc-ae48-47f0-ac1d-6fe04be77c28': 'sg',
  '34459445-c06e-42f7-be2e-268f78e8c69c': 'si',
  '0bd67977-9879-457e-9520-157e023d3e16': 'sn',
  '2dfd9596-0e0c-4870-85a1-10d2681ebf9b': 'sk',
  '652d0105-83d3-4136-bd06-5f923201d3ba': 'th',
  '6212e296-ed8b-4d1f-825e-294531419997': 'tr',
  'd752941f-d48e-49bd-b437-4866ccbd753d': 'tw',
  '70d6d707-6e40-4b13-a799-a2568ea6fdb8': 'ua',
  '7e22fca3-d235-4486-9cd7-85a8cf4eb6da': 'us',
  '1814231e-b355-4269-a1e4-cdc7be556cdb': 'uy',
  'b1b41f42-24f9-4f50-bff2-43f909c0b970': 'vn',
  'a806aab1-d130-4c6d-b097-2f33c75d3e14': 'za',
}
