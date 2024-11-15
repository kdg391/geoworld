'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'

import styles from './index.module.css'

import type { Coords } from '@/types/index.js'

const GoogleMap = dynamic(() => import('../GoogleMap.js'))

interface Props {
  addNewLocation: (loc: google.maps.LatLngLiteral, panoId: string) => void
  locations: Coords[]
  setSelectedLocation: React.Dispatch<React.SetStateAction<Coords | null>>
  onLoaded: (map: google.maps.Map) => void
}

const BuilderMap = ({
  addNewLocation,
  locations,
  setSelectedLocation,
  onLoaded,
}: Props) => {
  const mapRef = useRef<google.maps.Map | null>(null)
  const markers = useRef<google.maps.marker.AdvancedMarkerElement[]>([])

  useEffect(() => {
    renderMarkers()
  }, [locations])

  const initMap = (map: google.maps.Map) => {
    onLoaded(map)

    mapRef.current = map

    const svLayer = new google.maps.StreetViewCoverageLayer()
    svLayer.setMap(map)

    const streetViewService = new google.maps.StreetViewService()

    map.addListener('click', async (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return

      const location = event.latLng.toJSON()

      await streetViewService
        .getPanorama({ location })
        .then(({ data }) => {
          if (!data.location || !data.location.latLng) return

          addNewLocation(data.location.latLng.toJSON(), data.location.pano)
        })
        .catch(console.error)
    })
  }

  const renderMarkers = () => {
    if (!mapRef.current) return

    for (const marker of markers.current) {
      marker.map = null
    }

    markers.current = []

    for (const loc of locations) {
      const pinBackground = new google.maps.marker.PinElement({
        background: '#04d61d',
      })

      pinBackground.style.cursor = 'pointer'

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: loc,
        content: pinBackground.element,
      })

      marker.addListener('click', () => {
        setSelectedLocation(loc)
      })

      markers.current.push(marker)
    }
  }

  return (
    <GoogleMap
      defaultOptions={{
        center: {
          lat: 0,
          lng: 0,
        },
        clickableIcons: false,
        draggableCursor: 'crosshair',
        scrollwheel: true,
        zoom: 1,
        zoomControl: true,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP,
      }}
      onLoaded={(map) => initMap(map)}
      className={styles['builder-map']}
    />
  )
}

export default BuilderMap
