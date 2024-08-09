'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'

import useGoogleApi from '../../hooks/useGoogleApi.js'

import styles from './index.module.css'

import type { GameView } from '../../types/index.js'

const GoogleMap = dynamic(() => import('../GoogleMap.js'))

interface Props {
  actualLocations: google.maps.LatLngLiteral[]
  guessedLocations: (google.maps.LatLngLiteral | null)[]
  round: number
  view: GameView | null
}

const ResultMap = ({
  actualLocations,
  guessedLocations,
  round,
  view,
}: Props) => {
  const resultMapRef = useRef<google.maps.Map | null>(null)

  const actualMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>(
    [],
  )
  const guessedMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>(
    [],
  )
  const polylinesRef = useRef<google.maps.Polyline[]>([])

  const { isLoaded } = useGoogleApi()

  const fitMapBounds = () => {
    if (!resultMapRef.current) return

    const bounds = new google.maps.LatLngBounds()

    if (view === 'finalResult') {
      for (let i = 0; i < guessedLocations.length; i++) {
        bounds.extend(actualLocations[i])

        const guess = guessedLocations[i]
        if (guess !== null) bounds.extend(guess)
      }
    } else {
      bounds.extend(actualLocations[round - 1])

      const guess = guessedLocations[guessedLocations.length - 1]
      if (guess !== null) bounds.extend(guess)
    }

    resultMapRef.current.fitBounds(bounds)
    resultMapRef.current.setCenter(bounds.getCenter())
  }

  const renderMarkers = () => {
    for (const marker of actualMarkersRef.current) {
      marker.map = null
    }

    actualMarkersRef.current = []

    for (const marker of guessedMarkersRef.current) {
      marker.map = null
    }

    guessedMarkersRef.current = []

    if (view === 'finalResult') {
      for (let i = 0; i < guessedLocations.length; i++) {
        const pinBackground = new google.maps.marker.PinElement({
          background: '#04d61d',
        })

        pinBackground.style.cursor = 'pointer'

        const actual = new google.maps.marker.AdvancedMarkerElement({
          map: resultMapRef.current,
          position: actualLocations[i],
          content: pinBackground.element,
        })

        const guessed = new google.maps.marker.AdvancedMarkerElement({
          map: resultMapRef.current,
          position: guessedLocations[i],
        })

        actualMarkersRef.current.push(actual)
        guessedMarkersRef.current.push(guessed)
      }
    } else {
      const pinBackground = new google.maps.marker.PinElement({
        background: '#04d61d',
      })

      pinBackground.style.cursor = 'pointer'

      const actual = new google.maps.marker.AdvancedMarkerElement({
        map: resultMapRef.current,
        position: actualLocations[round - 1],
        content: pinBackground.element,
      })

      const guessed = new google.maps.marker.AdvancedMarkerElement({
        map: resultMapRef.current,
        position: guessedLocations[guessedLocations.length - 1],
      })

      actualMarkersRef.current.push(actual)
      guessedMarkersRef.current.push(guessed)
    }
  }

  const renderPolylines = () => {
    const lineSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      scale: 2,
    }

    const polylineOptions = {
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 0,
      icons: [
        {
          icon: lineSymbol,
          offset: '0',
          repeat: '8px',
        },
      ],
      map: resultMapRef.current,
    }

    for (const polyline of polylinesRef.current) {
      polyline.setMap(null)
    }

    polylinesRef.current = []

    if (view === 'finalResult') {
      for (let i = 0; i < actualLocations.length; i++) {
        const loc = guessedLocations[i]

        const polyline = new google.maps.Polyline({
          ...polylineOptions,
          path: [actualLocations[i], ...(loc !== null ? [loc] : [])],
        })

        polylinesRef.current.push(polyline)
      }
    } else {
      const loc = guessedLocations[guessedLocations.length - 1]

      const polyline = new google.maps.Polyline({
        ...polylineOptions,
        path: [actualLocations[round - 1], ...(loc !== null ? [loc] : [])],
      })

      polylinesRef.current.push(polyline)
    }
  }

  useEffect(() => {
    if (!isLoaded) return
    if (guessedLocations.length === 0) return
    if (!(view === 'result' || view === 'finalResult')) return

    renderMarkers()
    renderPolylines()
    fitMapBounds()
  }, [isLoaded, actualLocations, guessedLocations, view])

  return (
    <GoogleMap
      defaultOptions={{
        clickableIcons: false,
        disableDefaultUI: true,
        gestureHandling: 'greedy',
        zoomControl: true,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP,
      }}
      onLoaded={(map) => {
        resultMapRef.current = map
      }}
      className={styles['result-map']}
    />
  )
}

export default ResultMap
