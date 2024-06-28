import type { DistanceUnit } from '../types/index.js'

const EARTH_RADIUS = {
    imperial: 3958.8,
    metric: 6378.137,
}

const rad = (n: number) => n * (Math.PI / 180)

// https://stackoverflow.com/a/1502821
export function calculateDistance(
    l1: google.maps.LatLngLiteral,
    l2: google.maps.LatLngLiteral,
    unit: DistanceUnit,
) {
    const R = EARTH_RADIUS[unit]

    const dLat = rad(l2.lat - l1.lat)
    const dLong = rad(l2.lng - l1.lng)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(l1.lat)) *
            Math.cos(rad(l2.lat)) *
            Math.sin(dLong / 2) *
            Math.sin(dLong / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c

    return d
}

const DEFAULT_SCORE_FACTOR = 2000
const MAX_POINTS = 5000

// https://github.com/benlikescode/geohub/blob/main/backend/utils/calculateRoundScore.ts
export function calculateRoundScore(
    distance: number,
    scoreFactor = DEFAULT_SCORE_FACTOR,
) {
    if (distance * 1000 < 25) return MAX_POINTS

    const power = (distance * -1) / scoreFactor
    const score = MAX_POINTS * Math.pow(Math.E, power)

    if (score < 0) return 0

    return Math.round(score)
}

// https://github.com/benlikescode/geohub/blob/main/backend/utils/calculateMapScoreFactor.ts
export const calculateScoreFactor = (bounds: {
    min: google.maps.LatLngLiteral
    max: google.maps.LatLngLiteral
}) => {
    const { min, max } = bounds

    const distance = calculateDistance(min, max, 'metric')

    const scoreFactor = (DEFAULT_SCORE_FACTOR * distance) / 18150

    return scoreFactor
}

export const formatTimeLeft = (timeLeft: number) => {
    const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
    const secs = String(timeLeft % 60).padStart(2, '0')

    return `${mins}:${secs}`
}

// https://stackoverflow.com/a/12646864
export const shuffleArray = <T>(arr: T[]) => {
    const newArr = [...arr]

    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
    }

    return newArr
}

export const classNames = (...args: string[]) =>
    args.filter((c) => c !== '').join(' ')

export const toCodePoint = (str: string) => {
    const r = []

    for (const s of str) {
        const c = s.codePointAt(0) as number

        r.push(c.toString(16))
    }

    return r.join('-')
}
