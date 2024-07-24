'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

import useGoogleApi from '../../hooks/useGoogleApi.js'

import { classNames } from '../../utils/index.js'

import styles from './page.module.css'

const GoogleMap = dynamic(() => import('../../components/GoogleMap.js'))

const randomLatLng = (): google.maps.LatLngLiteral => {
  const lat = Math.random() * 180 - 90
  const lng = Math.random() * 360 - 180

  return {
    lat,
    lng,
  }
}

const RandomStreetView = () => {
  const [showMap, setShowMap] = useState(false)

  const svPanoramaElRef = useRef<HTMLDivElement | null>(null)

  const mapRef = useRef<google.maps.Map | null>(null)
  const svPanoramaRef = useRef<google.maps.StreetViewPanorama | null>(null)
  const svServiceRef = useRef<google.maps.StreetViewService | null>(null)

  const { isLoaded, loadApi } = useGoogleApi()

  const initMap = (map: google.maps.Map) => {
    const svLayer = new google.maps.StreetViewCoverageLayer()
    svLayer.setMap(map)

    mapRef.current = map
  }

  const initStreetView = () => {
    const svPanorama = new google.maps.StreetViewPanorama(
      svPanoramaElRef.current as HTMLDivElement,
      {
        addressControl: false,
        fullscreenControl: false,
      },
    )
    svPanoramaRef.current = svPanorama

    const svService = new google.maps.StreetViewService()
    svServiceRef.current = svService

    loadPanorama(randomLatLng())
  }

  const loadPanorama = (location: google.maps.LatLngLiteral) => {
    if (!svPanoramaRef.current) return
    if (!svServiceRef.current) return

    svServiceRef.current
      .getPanorama({
        location,
        preference: google.maps.StreetViewPreference.BEST,
        sources: [google.maps.StreetViewSource.OUTDOOR],
        radius: 10_000,
      })
      .then(({ data }) => {
        if (data.location) {
          svPanoramaRef.current?.setPano(data.location.pano)
          svPanoramaRef.current?.setPov({
            heading: 0,
            pitch: 0,
          })

          if (data.location.latLng)
            mapRef.current?.setCenter(data.location.latLng)
        }
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
      <div className={styles['btn-container']}>
        <button onClick={() => setShowMap((s) => !s)}>Toggle Map</button>
        <button
          onClick={() => {
            loadPanorama(randomLatLng())
          }}
        >
          Get Street View
        </button>
      </div>

      <div
        className={classNames(styles['map-container'], showMap ? 'active' : '')}
      >
        <GoogleMap
          defaultOptions={{
            center: {
              lat: 0,
              lng: 0,
            },
            zoom: 1,
            disableDefaultUI: true,
            clickableIcons: false,
            streetViewControl: true,
          }}
          onLoaded={(map) => initMap(map)}
          className={styles.map}
        />
      </div>

      <div ref={svPanoramaElRef} className={styles['street-view']} />
    </main>
  )
}

export default RandomStreetView
