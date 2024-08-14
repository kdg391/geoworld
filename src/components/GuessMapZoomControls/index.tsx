'use client'

import { Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

import styles from './index.module.css'

const MIN_ZOOM = 0
const MAX_ZOOM = 22

interface Props {
  map: google.maps.Map | null
}

const GuessMapZoomControls = ({ map }: Props) => {
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    if (!map) return

    const zoomChangeEvent = map.addListener('zoom_changed', () => {
      const zoom = map.getZoom()

      if (zoom === undefined) return

      setZoom(zoom)
    })

    return () => zoomChangeEvent.remove()
  }, [map])

  return (
    <div className={styles['guess-map-zoom-controls']}>
      <button
        disabled={zoom >= MAX_ZOOM}
        aria-label="Zoom In"
        onClick={() => {
          if (!map) return

          const zoom = map.getZoom()

          if (zoom === undefined) return

          map.setZoom(zoom + 1)
        }}
      >
        <Plus size={20} />
      </button>
      <button
        disabled={zoom <= MIN_ZOOM}
        aria-label="Zoom Out"
        onClick={() => {
          if (!map) return

          const zoom = map.getZoom()

          if (zoom === undefined) return

          map.setZoom(zoom - 1)
        }}
      >
        <Minus size={20} />
      </button>
    </div>
  )
}

export default GuessMapZoomControls
