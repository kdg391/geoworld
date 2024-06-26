import type { MapData } from '../types/index.js'

export const MAX_ROUNDS = 10
export const DEFAULT_ROUNDS = 5

export const DEFAULT_MAP_OPTIONS: google.maps.MapOptions = {
    center: {
        lat: 0,
        lng: 0,
    },
}

// flags and languages
export const FLAG_ENOJIS = {
    au: '🇦🇺',
    ca: '🇨🇦',
    cn: '🇨🇳',
    de: '🇩🇪',
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

export const LANGUAGES = ['en', 'ko'] as const

export const LANGUAGE_NAMES = {
    en: 'English',
    ko: '한국어',
}

export const LANGUAGE_FLAGS = {
    en: FLAG_ENOJIS.us,
    ko: FLAG_ENOJIS.kr,
}

// Official Maps
export const OFFICIAL_MAPS: MapData[] = [
    {
        code: 'au',
        locations: [
            {
                lat: -33.85014308559627,
                lng: 151.02919986348329,
            },
            {
                lat: -37.78203009014479,
                lng: 144.76599435316174,
            },
            {
                lat: -33.10845899896079,
                lng: 118.23732306321993,
            },
        ],
    },
    {
        code: 'ca',
        locations: [],
    },
    {
        code: 'cn',
        locations: [],
    },
    {
        code: 'de',
        locations: [],
    },
    {
        code: 'fr',
        locations: [],
    },
    {
        code: 'gb',
        locations: [],
    },
    {
        code: 'it',
        locations: [],
    },
    {
        code: 'jp',
        locations: [],
    },
    {
        code: 'kr',
        locations: [
            {
                lat: 37.575720018048926,
                lng: 126.97684798642592,
            },
            {
                lat: 37.55690155687554,
                lng: 126.93682388773215,
            },
            {
                lat: 37.514031557748176,
                lng: 127.1023281474149,
            },
            {
                lat: 37.53652151409364,
                lng: 127.12562579531055,
            },
            {
                lat: 37.61746277495953,
                lng: 127.02869738682728,
            },
            {
                lat: 37.48574041108942,
                lng: 126.88875753737564,
            },
            {
                lat: 37.54735572980324,
                lng: 126.97384040749344,
            },
            {
                lat: 37.45237298579521,
                lng: 126.6650447233678,
            },
            {
                lat: 37.85971818738339,
                lng: 126.80532573320649,
            },
            {
                lat: 34.79468716655469,
                lng: 126.38349518339682,
            },
            {
                lat: 35.153788738879406,
                lng: 129.06723171380168,
            },
            {
                lat: 36.78315419993303,
                lng: 127.01389560527161,
            },
            {
                lat: 35.82029882200836,
                lng: 127.11811588424906,
            },
            {
                lat: 35.16774807652713,
                lng: 126.907632875594,
            },
            {
                lat: 37.556448593379194,
                lng: 127.01377869487231,
            },
            {
                lat: 37.56541420132255,
                lng: 127.03403612898177,
            },
            {
                lat: 37.430318050115034,
                lng: 126.8358602328918,
            },
            {
                lat: 35.4790549572496,
                lng: 126.46042325901945,
            },
            {
                lat: 37.0527228656771,
                lng: 129.41420216221687,
            },
            {
                lat: 37.607723236083984,
                lng: 127.029052734375,
            },
            {
                lat: 37.05269044058162,
                lng: 129.41425663060005,
            },
            {
                lat: 37.48533630371094,
                lng: 126.74980163574219,
            },
            {
                lat: 37.2992251466232,
                lng: 127.36245110213048,
            },
            {
                lat: 37.53431797919674,
                lng: 126.65329064513217,
            },
            {
                lat: 37.51816940307617,
                lng: 127.03845977783203,
            },
            {
                lat: 37.5505485534668,
                lng: 126.97724914550781,
            },
            {
                lat: 35.78984017699501,
                lng: 129.4589650673618,
            },
            {
                lat: 35.528141021728516,
                lng: 126.72005462646484,
            },
            {
                lat: 37.75394598777314,
                lng: 128.880513373939,
            },
            {
                lat: 37.64705864334816,
                lng: 126.89904965277877,
            },
            {
                lat: 37.59162348865491,
                lng: 127.01799562521938,
            },
            {
                lat: 37.539582808428044,
                lng: 127.20250714821834,
            },
            {
                lat: 34.78729245858732,
                lng: 126.7151079384892,
            },
            {
                lat: 34.75989106287383,
                lng: 127.67007703199964,
            },
            {
                lat: 37.02841655797495,
                lng: 128.2697630113213,
            },
            {
                lat: 35.80001814864978,
                lng: 127.09496549602783,
            },
            {
                lat: 33.48879356762604,
                lng: 126.5363063489179,
            },
            {
                lat: 33.48752965255369,
                lng: 126.42976866528453,
            },
            {
                lat: 33.251010435745116,
                lng: 126.51055337449287,
            },
            {
                lat: 33.255745261089906,
                lng: 126.57446597230847,
            },
            {
                lat: 33.37796748400224,
                lng: 126.26304553860057,
            },
            {
                lat: 33.381203465204315,
                lng: 126.88086877608842,
            },
            {
                lat: 37.48788438437071,
                lng: 127.02075677820582,
            },
            {
                lat: 37.48129417934491,
                lng: 126.97848841898698,
            },
            {
                lat: 37.526978481548866,
                lng: 126.84330373028348,
            },
            {
                lat: 37.58562833490634,
                lng: 128.414755780652,
            },
            {
                lat: 34.83070633972316,
                lng: 127.64692420113155,
            },
            {
                lat: 36.030957611686155,
                lng: 129.3656475910632,
            },
            {
                lat: 37.444181691620365,
                lng: 126.45522708231876,
            },
            {
                lat: 37.558972337464716,
                lng: 126.80670133502659,
            },
            {
                lat: 37.53086116751848,
                lng: 127.20588243313226,
            },
            {
                lat: 37.507427417107074,
                lng: 126.785365987164,
            },
            {
                lat: 37.56133729439014,
                lng: 126.99425366559477,
            },
            {
                lat: 37.57558776760773,
                lng: 126.97680364736597,
            },
            {
                lat: 34.92459487915039,
                lng: 126.50029754638672,
            },
            {
                lat: 34.92459487915039,
                lng: 126.50029754638672,
            },
            {
                lat: 37.26350784301758,
                lng: 126.95733642578125,
            },
            {
                lat: 37.29853182968892,
                lng: 126.81400795333258,
            },
            {
                lat: 37.553465982390215,
                lng: 126.96987499202926,
            },
        ],
    },
    {
        code: 'pl',
        locations: [],
    },
    {
        code: 'sg',
        locations: [],
    },
    {
        code: 'tw',
        locations: [],
    },
    {
        code: 'us',
        locations: [
            {
                lat: 40.68863255835635,
                lng: -74.24773065734054,
            },
            {
                lat: 32.74185467838551,
                lng: -96.83213796024361,
            },
            {
                lat: 36.11549784163438,
                lng: -115.19706412586717,
            },
            {
                lat: 37.343175492154934,
                lng: -121.88837624052333,
            },
            {
                lat: 47.6017273824806,
                lng: -122.32959835427592,
            },
            {
                lat: 41.96594618689584,
                lng: -88.22288496916957,
            },
            {
                lat: 21.544517093193747,
                lng: -158.1669736625631,
            },
            {
                lat: 37.373994549923104,
                lng: -91.4295586502568,
            },
            {
                lat: 29.71657943725586,
                lng: -95.4045181274414,
            },
        ],
    },
]

const WORLD_MAP: MapData = {
    code: 'worldwide',
    locations: OFFICIAL_MAPS.map((m) => m.locations).flat(1),
}

OFFICIAL_MAPS.unshift(WORLD_MAP)
