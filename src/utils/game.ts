import bbox from '@turf/bbox'
import { featureCollection, point } from '@turf/helpers'

import type { DistanceUnit } from '../types/index.js'

const EARTH_RADIUS = {
  imperial: 3958.8,
  metric: 6378.137,
}

const rad = (n: number) => n * (Math.PI / 180)

// https://stackoverflow.com/a/1502821
export const calculateDistance = (
  l1: google.maps.LatLngLiteral,
  l2: google.maps.LatLngLiteral,
  unit: DistanceUnit,
) => {
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
export const calculateRoundScore = (
  distance: number,
  scoreFactor = DEFAULT_SCORE_FACTOR,
) => {
  if (distance * 1000 < 25) return MAX_POINTS

  const power = (distance * -1) / scoreFactor
  const score = MAX_POINTS * Math.pow(Math.E, power)

  if (score < 0) return 0

  return Math.round(score)
}

// https://github.com/benlikescode/geohub/blob/main/backend/utils/getMapBounds.ts
export const calculateMapBounds = (locations: google.maps.LatLngLiteral[]) => {
  // Format locations for turfJS
  const coordinates = locations.map((x) => [x.lng, x.lat])
  const points = coordinates.map((coord) => point(coord))

  // Get bounding box around map's locations
  const fc = featureCollection(points)
  const box = bbox(fc)

  // Get the distance between the two bounding points
  const min = { lat: box[1], lng: box[0] }
  const max = { lat: box[3], lng: box[2] }

  return { min, max }
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
