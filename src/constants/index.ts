export const OFFICIAL_COUNTRY_CODES = [
  'ad', // Andorra
  'ae', // United Arab Emirates
  'al', // Albania
  'ar', // Argentina
  'at', // Austria
  'au', // Austrailia
  'bd', // Bangladesh
  'be', // Belgium
  'bo', // Bolivia
  'br', // Brazil
  'bt', // Bhutan
  'bw', // Botswana
  'ca', // Canada
  'ch', // Switzerland
  'cl', // Chile
  'co', // Colombia
  'cx', // Christmas Island
  'cz', // Czech Republic
  'de', // Germany
  'dk', // Denmark
  'do', // Dominican Republic
  'ec', // Ecuador
  'ee', // Estonia
  'es', // Spain
  'fi', // Finland
  'fr', // France
  'gb', // United Kingdom
  'gh', // Ghana
  'gr', // Greece
  'gt', // Guatemala
  'hk', // Hong Kong
  'hr', // Croatia
  'hu', // Hungary
  'id', // Indonesia
  'il', // Israel
  'in', // India
  'is', // Iceland
  'it', // Italy
  'jo', // Jordan
  'jp', // Japan
  'ke', // Kenya
  'kg', // Kyrgyzstan
  'kh', // Cambodia
  'kr', // South Korea
  'kz', // Kazakhstan
  'lb', // Lebanon
  'lk', // Sri Lanka
  'ls', // Lesotho
  'lt', // Lithuania
  'lu', // Luxembourg
  'lv', // Latvia
  'mc', // Monaco
  'me', // Montenegro
  'mk', // North Macedonia
  'mn', // Mongolia
  'mo', // Macau
  'mx', // Mexico
  'my', // Malaysia
  'ng', // Nigeria
  'nl', // Netherlands
  'no', // Norway
  'nz', // New Zealand
  'om', // Oman
  'pa', // Panama
  'pe', // Peru
  'ph', // Philippines
  'pl', // Poland
  'pr', // Puerto Rico
  'pt', // Portugal
  'qa', // Qatar
  'ro', // Romania
  'rs', // Serbia
  'ru', // Russia
  'rw', // Rwanda
  'se', // Sweden
  'sg', // Singapore
  'si', // Slovenia
  'sk', // Slovakia
  'sn', // Senegal
  'sz', // Eswatini
  'th', // Thailand
  'tn', // Tunisia
  'tr', // Turkey
  'tw', // Taiwan
  'ua', // Ukraine
  'ug', // Uganda
  'us', // United States
  'uy', // Uruguay
  'za', // South Africa
] as const

export const WORLD_EMOJI = '🌐'

export const FLAG_ENOJIS: Record<
  (typeof OFFICIAL_COUNTRY_CODES)[number],
  string
> = {
  ad: '🇦🇩',
  ae: '🇦🇪',
  al: '🇦🇱',
  ar: '🇦🇷',
  at: '🇦🇹',
  au: '🇦🇺',
  bd: '🇧🇩',
  be: '🇧🇪',
  bo: '🇧🇴',
  br: '🇧🇷',
  bt: '🇧🇹',
  bw: '🇧🇼',
  ca: '🇨🇦',
  ch: '🇨🇭',
  cl: '🇨🇱',
  co: '🇨🇴',
  cx: '🇨🇽',
  cz: '🇨🇿',
  de: '🇩🇪',
  dk: '🇩🇰',
  do: '🇩🇴',
  ec: '🇪🇨',
  ee: '🇪🇪',
  es: '🇪🇸',
  fi: '🇫🇮',
  fr: '🇫🇷',
  gb: '🇬🇧',
  gh: '🇬🇭',
  gr: '🇬🇷',
  gt: '🇬🇹',
  hk: '🇭🇰',
  hr: '🇭🇷',
  hu: '🇭🇺',
  id: '🇮🇩',
  il: '🇮🇱',
  in: '🇮🇳',
  is: '🇮🇸',
  it: '🇮🇹',
  jo: '🇯🇴',
  jp: '🇯🇵',
  ke: '🇰🇪',
  kg: '🇰🇬',
  kh: '🇰🇭',
  kr: '🇰🇷',
  kz: '🇰🇿',
  lb: '🇱🇧',
  lk: '🇱🇰',
  ls: '🇱🇸',
  lt: '🇱🇹',
  lu: '🇱🇺',
  lv: '🇱🇻',
  mc: '🇲🇨',
  me: '🇲🇪',
  mk: '🇲🇰',
  mn: '🇲🇳',
  mo: '🇲🇴',
  mx: '🇲🇽',
  my: '🇲🇾',
  ng: '🇳🇬',
  nl: '🇳🇱',
  no: '🇳🇴',
  nz: '🇳🇿',
  om: '🇴🇲',
  pa: '🇵🇦',
  pe: '🇵🇪',
  ph: '🇵🇭',
  pl: '🇵🇱',
  pr: '🇵🇷',
  pt: '🇵🇹',
  qa: '🇶🇦',
  ro: '🇷🇴',
  rs: '🇷🇸',
  ru: '🇷🇺',
  rw: '🇷🇼',
  se: '🇸🇪',
  sg: '🇸🇬',
  si: '🇸🇮',
  sk: '🇸🇰',
  sn: '🇸🇳',
  sz: '🇸🇿',
  th: '🇹🇭',
  tn: '🇹🇳',
  tr: '🇹🇷',
  tw: '🇹🇼',
  ua: '🇺🇦',
  ug: '🇺🇬',
  us: '🇺🇸',
  uy: '🇺🇾',
  za: '🇿🇦',
}

export const OFFICIAL_MAP_WORLD_ID = '8c050dd2-d8da-41a9-a83a-d386d051afd3'

export const OFFICIAL_MAP_COUNTRY_CODES: Record<
  string,
  (typeof OFFICIAL_COUNTRY_CODES)[number]
> = {
  '60d0444b-2b2b-4bb2-8dbf-b88db8135ab9': 'ad',
  '9e12e884-a2c4-4831-acad-b42d5d3fbfbc': 'ae',
  'a94775af-ecc8-42c0-981b-392a189a233f': 'al',
  '8f657fd9-7230-401a-8246-d9624539dcab': 'ar',
  '0dff5609-91cc-4bef-9b29-4f36c73c5a06': 'at',
  '53665461-aa6e-4045-8d8a-f0f55b54b3fc': 'au',
  '9753e3f2-d2ad-43be-8bf5-14f104f06de5': 'bd',
  '9720b80f-aa99-4653-9f96-a59deed8fef2': 'be',
  '2cb4895a-75f3-4617-b023-23c67f0ed332': 'bo',
  '7ce7a788-00ee-46ab-be08-a241d8959336': 'br',
  'bee9545a-fd7b-4bb0-8519-edda4753dfed': 'bt',
  '2632bd6b-2316-49c1-9b0d-139cae1741b2': 'bw',
  '2d795a95-55f6-422e-94da-ab932e20101f': 'ca',
  '907f2236-114a-4a9b-b231-603d97c94f11': 'ch',
  '14b64e7b-77ae-4355-a700-a3ea392816fa': 'cl',
  '473149ad-a6a4-4281-bb42-75e998f68b6c': 'co',
  'aa6633b6-5b7a-435b-bb4b-ab281d8b2cc4': 'cx',
  '8f394e48-4d75-476c-8b03-07d58798fce9': 'cz',
  '315cc0d0-a456-4f15-ad8a-491bab56be1f': 'de',
  '440bc7f1-b6e4-4667-ba16-cb0382484903': 'dk',
  '8f3a7104-39f6-4e6d-b0f5-2b7d92670cd3': 'do',
  'b292c586-638d-454f-8a02-574c8c8189f7': 'ec',
  '68b55f84-9e53-4f5f-824e-2ea185c78d06': 'ee',
  '0d8a6a60-b4e9-47f4-ab83-4d8f5651398d': 'es',
  '14bb01e9-8725-4ac5-a835-0a7a120c960d': 'fi',
  'c311ae84-f897-48e7-bf25-3189811e51e8': 'fr',
  '4a779607-3ed6-487c-8331-0624cee83874': 'gb',
  '227bf96f-c636-4f45-aa52-dd783c1718f9': 'gh',
  'ae2a23de-69b0-45ab-beae-2c536f19e30f': 'gt',
  'bace22f6-ea1a-4e16-b3ec-7b59c2892fa3': 'gr',
  'c7491504-7daf-4200-bd96-0cb43934fa1f': 'hk',
  '0d2ef220-1362-4d72-a12c-9eb7b8eb078e': 'hr',
  '34bbe5bb-ed54-4494-b433-f834b48f0db7': 'hu',
  '31ca7eec-53e2-4a75-ae10-0f7cc6219541': 'id',
  '97b7fb05-762a-4248-a26a-6bc6bf53456c': 'il',
  '5e275a5f-477d-4ff4-b916-b496cb60ff11': 'in',
  '47e6aba2-a008-4aa6-b808-4f98bcb0295e': 'is',
  '646d9a6c-6bd0-4b85-9881-b8cb69a7f3c7': 'it',
  'b2e4d2d5-ef6d-4af2-b96c-ae62696ad745': 'jo',
  '82f85bac-dfb0-4d54-bd65-6b7abd9de027': 'jp',
  '22e96b5c-522a-432a-ad13-93c75a10c66e': 'ke',
  'a5627052-074f-41ce-aa04-1bde2ec2dfdd': 'kg',
  '90d1fef4-eaed-429b-8af0-f161d98acbb1': 'kh',
  '3e91889b-b04a-48ab-abed-035aad71a75c': 'kr',
  'cebdbf5f-23ed-404c-9ec9-e5fa00cd5d60': 'kz',
  'abe5ce8b-0120-4966-8878-19717f9c3646': 'lb',
  '214483ff-9c25-4ca5-be23-3fdc17abdd57': 'lk',
  'd591bd77-9725-468d-96df-ff7e487c574a': 'ls',
  '16698cf5-b562-48a3-9741-015438b97968': 'lt',
  '5f91600f-4f00-4191-861f-1b780ff0dcd4': 'lu',
  '38042a93-fd84-4cc1-bf2c-c492160bed96': 'lv',
  '5eb209c8-c4dd-4d9e-acc4-2c957b89a65f': 'mc',
  'b7378695-3ee4-4a75-8d10-5a60a4ab4b18': 'me',
  '08726ff8-e51e-45d4-a500-b597f6e14afd': 'mk',
  '91ed1f28-0d6c-4853-a63c-d85082b5c913': 'mn',
  'fa5b7a28-bcba-4fc7-9526-6a5355cad8cf': 'mo',
  '54634743-007f-4970-8f68-2062c128dbcd': 'mx',
  '366cdc87-9f50-4648-86e8-b5564ce1744f': 'my',
  '2d041f20-264a-4ed0-9908-d3fc3176f1c2': 'ng',
  '5a7dc181-b266-4f3d-9ec6-461cb4285021': 'nl',
  '56852ba0-bff8-4731-ad6b-8d89abe9e0ac': 'no',
  '0cce108b-98c8-4669-82a2-427ad095cd20': 'nz',
  '2f05fa80-d76e-4548-8034-777b692e0af3': 'om',
  '2f477c92-c7bc-4c1e-96d7-3d0e683dafd9': 'pa',
  'ea4b2235-0507-48e4-a97e-06b1aba8fa20': 'pe',
  '6bc97ec1-43f0-4247-9ba5-dd25cf25d43c': 'ph',
  'afd0e5d1-6fc0-4621-97c1-3c92f4ff9930': 'pl',
  '3d5c8ce9-acff-40eb-b966-8c3e573baa7e': 'pr',
  'a9bd8f88-828c-4296-8c92-9d689e224907': 'pt',
  '7699a313-f35b-49f4-bd01-2c2b55c63b56': 'qa',
  '4ddfbc5f-cdca-49dc-b684-f93dec9cf63b': 'ro',
  'b40ba73a-cd9e-4dbb-8f57-f05c15e27e59': 'rs',
  'a6000e3e-ab1c-415b-849b-93d9289ee88d': 'ru',
  '1b201b97-d2cb-49a1-bd59-3171c0b66048': 'rw',
  '9deee185-bf34-4784-a9dc-3cc6e8704e19': 'se',
  'c5c8fafc-ae48-47f0-ac1d-6fe04be77c28': 'sg',
  '34459445-c06e-42f7-be2e-268f78e8c69c': 'si',
  '2dfd9596-0e0c-4870-85a1-10d2681ebf9b': 'sk',
  '0bd67977-9879-457e-9520-157e023d3e16': 'sn',
  '69d65afa-effc-44e9-8254-01e9dd979605': 'sz',
  '652d0105-83d3-4136-bd06-5f923201d3ba': 'th',
  'a6fc16ef-c069-47b5-b039-8ad6cf022230': 'tn',
  '6212e296-ed8b-4d1f-825e-294531419997': 'tr',
  'd752941f-d48e-49bd-b437-4866ccbd753d': 'tw',
  '70d6d707-6e40-4b13-a799-a2568ea6fdb8': 'ua',
  'afd6ff78-acec-4a1f-8c1b-0ebfcd4dbf1c': 'ug',
  '7e22fca3-d235-4486-9cd7-85a8cf4eb6da': 'us',
  '1814231e-b355-4269-a1e4-cdc7be556cdb': 'uy',
  'a806aab1-d130-4c6d-b097-2f33c75d3e14': 'za',
}
