const EARTH_RADIUS = {
    metric: 6378.137,
    imperial: 3958.8,
}

const rad = (n: number) => n * (Math.PI / 180)

// https://stackoverflow.com/a/1502821
export function calculateDistance(
    l1: google.maps.LatLngLiteral,
    l2: google.maps.LatLngLiteral,
    unit: 'metric' | 'imperial',
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

// https://github.com/benlikescode/geohub/blob/main/backend/utils/calculateRoundScore.ts
export function calculateRoundScore(distance: number, scoreFactor = 2000) {
    if (distance * 1000 < 25) return 5000

    const power = (distance * -1) / scoreFactor
    const score = 5000 * Math.pow(Math.E, power)

    if (score < 0) return 0

    return Math.round(score)
}

export const formatTimeLeft = (timeLeft: number) => {
    const mins = Math.floor(timeLeft / 60)
        .toString()
        .padStart(2, '0')
    const secs = (timeLeft % 60).toString().padStart(2, '0')

    return `${mins}:${secs}`
}
