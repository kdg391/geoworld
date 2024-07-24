'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

import useGoogleApi from '../../hooks/useGoogleApi.js'

import styles from './page.module.css'

const GoogleMap = dynamic(() => import('../../components/GoogleMap.js'))

const LocationPicker = () => {
  const [position, setPosition] = useState<google.maps.LatLngLiteral | null>(
    null,
  )

  const svPanoramaElRef = useRef<HTMLDivElement | null>(null)

  const svPanoramaRef = useRef<google.maps.StreetViewPanorama | null>(null)
  const svServiceRef = useRef<google.maps.StreetViewService | null>(null)

  const { isLoaded, loadApi } = useGoogleApi()

  const initMap = (map: google.maps.Map) => {
    const svLayer = new google.maps.StreetViewCoverageLayer()
    svLayer.setMap(map)

    map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        loadPanorama(event.latLng.toJSON())
      }
    })
  }

  const initStreetView = () => {
    const svPanorama = new google.maps.StreetViewPanorama(
      svPanoramaElRef.current as HTMLDivElement,
    )
    svPanoramaRef.current = svPanorama

    const svService = new google.maps.StreetViewService()
    svServiceRef.current = svService

    svPanorama.addListener('position_changed', () => {
      const position = svPanorama.getPosition()

      if (!position) return

      setPosition(position.toJSON())
    })
  }

  const loadPanorama = (location: google.maps.LatLngLiteral) => {
    if (!svPanoramaRef.current) return
    if (!svServiceRef.current) return

    svServiceRef.current
      .getPanorama({
        location,
      })
      .then(({ data }) => {
        if (data.location) svPanoramaRef.current?.setPano(data.location.pano)
      })
      .catch(console.error)
  }

  useEffect(() => {
    if (!isLoaded) loadApi()
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    if (!svPanoramaElRef.current) return

    initStreetView()
  }, [isLoaded])

  return (
    <main className={styles.main}>
      <div>
        <pre>
          <code>{JSON.stringify(position)}</code>
        </pre>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(
              JSON.stringify(position, null, '\t'),
            )

            alert('Copied completely')
          }}
        >
          Copy
        </button>
      </div>
      <div className={styles.container}>
        <GoogleMap
          defaultOptions={{
            center: {
              lat: 0,
              lng: 0,
            },
            zoom: 1,
            zoomControl: true,
            streetViewControl: true,
            scrollwheel: true,
            clickableIcons: false,
            draggableCursor: 'crosshair',
          }}
          onLoaded={(map) => initMap(map)}
          className={styles.map}
        />

        <div ref={svPanoramaElRef} className={styles.pano}></div>
      </div>
    </main>
  )
}

export default LocationPicker
