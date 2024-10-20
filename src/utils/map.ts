import { booleanPointInPolygon } from '@turf/boolean-point-in-polygon'
import { point } from '@turf/helpers'

import worldGeoJson from '../constants/country.geo.json' with { type: 'json' }

import 'server-only'

import type { Feature, Polygon } from 'geojson'

interface WorldGeoJson {
  features: Feature<Polygon>[]
}

export const getCountryFromCoordinates = (loc: google.maps.LatLngLiteral) => {
  const p = point([loc.lng, loc.lat])

  for (const feature of (worldGeoJson as WorldGeoJson).features) {
    if (booleanPointInPolygon(p, feature)) {
      return feature.properties?.iso_a2.toLowerCase()
    }
  }

  return null
}
