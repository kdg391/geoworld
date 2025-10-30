import { useState } from 'react'
import MapSelect from './MapSelect'

import { OFFICIAL_MAP_WORLD_ID } from '@/constants'

const Select = () => {
  const [mapId, setMapId] = useState(OFFICIAL_MAP_WORLD_ID)

  return (
    <div>
      <MapSelect selectedMap={mapId} setSelectedMap={setMapId} />
      <input type="hidden" name="map-id" value={mapId} />
    </div>
  )
}

export default Select
