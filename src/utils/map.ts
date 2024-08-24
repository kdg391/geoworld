import { booleanPointInPolygon } from '@turf/boolean-point-in-polygon'
import { point } from '@turf/helpers'

import worldGeoJson from '../constants/country.geo.json' with { type: 'json' }

export const getCountryFromCoordinates = (loc: google.maps.LatLngLiteral) => {
  const p = point([loc.lng, loc.lat])

  for (const feature of (worldGeoJson as any).features) {
    if (booleanPointInPolygon(p, feature)) {
      return feature.properties.iso_a2.toLowerCase()
    }
  }

  return null
}
