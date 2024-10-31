'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

import useGoogleApi from '@/hooks/useGoogleApi.js'

import { classNames, randomLatLng } from '@/utils/index.js'

import styles from './page.module.css'

const Button = dynamic(() => import('@/components/common/Button/index.js'))
const GoogleMap = dynamic(() => import('@/components/GoogleMap.js'))

const RandomStreetView = () => {
  const { isGoogleLoaded, loadGoogleApi } = useGoogleApi()

  const mapRef = useRef<google.maps.Map | null>(null)
  const svPanoramaRef = useRef<google.maps.StreetViewPanorama | null>(null)
  const svPanoramaElRef = useRef<HTMLDivElement | null>(null)
  const svServiceRef = useRef<google.maps.StreetViewService | null>(null)

  const [showMap, setShowMap] = useState(false)

  const initMap = (map: google.maps.Map) => {
    const svLayer = new google.maps.StreetViewCoverageLayer()
    svLayer.setMap(map)

    mapRef.current = map
  }

  const initStreetView = () => {
    if (!svPanoramaElRef.current) return

    const svPanorama = new google.maps.StreetViewPanorama(
      svPanoramaElRef.current as HTMLDivElement,
      {
        addressControl: false,
        disableDefaultUI: true,
        fullscreenControl: false,
        motionTracking: false,
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
        if (!data.location) return

        svPanoramaRef.current?.setPano(data.location.pano)
        svPanoramaRef.current?.setPov({
          heading: data.links?.[0].heading ?? 0,
          pitch: 0,
        })

        if (data.location.latLng)
          mapRef.current?.setCenter(data.location.latLng)
      })
      .catch(console.error)
  }

  useEffect(() => {
    if (!isGoogleLoaded) loadGoogleApi()
  }, [])

  useEffect(() => {
    if (!isGoogleLoaded) return

    initStreetView()
  }, [isGoogleLoaded])

  return (
    <main className={styles.main}>
      <div className={styles['btn-container']}>
        <Button
          variant="primary"
          size="s"
          onClick={() => setShowMap((s) => !s)}
        >
          Toggle Map
        </Button>
        <Button
          variant="primary"
          size="s"
          onClick={() => loadPanorama(randomLatLng())}
        >
          Get Street View
        </Button>
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
            clickableIcons: false,
            disableDefaultUI: true,
            streetViewControl: true,
            zoom: 1,
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
