'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'

import useGoogleApi from '@/hooks/useGoogleApi.js'

import ActualMarker from './ActualMarker.js'
import GuessMarker from './GuessMarker.js'

import styles from './index.module.css'

import type { GameView, Guess } from '@/types/game.js'
import type { RoundLocation } from '@/types/location.js'

const lineSymbol: google.maps.Symbol = {
  path: 'M 0,-1 0,1',
  strokeOpacity: 1,
  scale: 2,
}

const polylineOptions: google.maps.PolylineOptions = {
  strokeColor: '#000000',
  strokeOpacity: 0,
  icons: [
    {
      icon: lineSymbol,
      offset: '0',
      repeat: '8px',
    },
  ],
  clickable: false,
}

const GoogleMap = dynamic(() => import('../GoogleMap.js'))

interface Props {
  actualLocations: RoundLocation[]
  guessedLocations: Guess[]
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

  const { isGoogleLoaded } = useGoogleApi()

  const fitMapBounds = () => {
    if (!resultMapRef.current) return

    const bounds = new google.maps.LatLngBounds()

    if (view === 'finalResult') {
      for (let i = 0; i < guessedLocations.length; i++) {
        bounds.extend(actualLocations[i])

        const guess = guessedLocations[i].position
        if (guess !== null) bounds.extend(guess)
      }
    } else {
      bounds.extend(actualLocations[round])

      const guess = guessedLocations[round].position
      if (guess !== null) bounds.extend(guess)
    }

    resultMapRef.current.setCenter(bounds.getCenter())
    resultMapRef.current.fitBounds(bounds, {
      bottom: 20,
    })
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
        const actualContainer = document.createElement('div')
        const actualDiv = createRoot(actualContainer)

        actualDiv.render(<ActualMarker roundNumber={i + 1} isFinalResult />)

        const actualLoc = actualLocations[i]

        const actualMarker = new google.maps.marker.AdvancedMarkerElement({
          map: resultMapRef.current,
          position: {
            lat: actualLoc.lat,
            lng: actualLoc.lng,
          },
          content: actualContainer,
        })

        actualMarker.addListener('click', () => {
          window.open(
            `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${actualLoc.lat},${actualLoc.lng}&heading=${actualLoc.heading}&pitch=${actualLoc.pitch}&fov=180&pano=${actualLoc.panoId}`,
            '_blank',
          )
        })

        const guessContainer = document.createElement('div')
        const guessDiv = createRoot(guessContainer)

        guessDiv.render(<GuessMarker />)

        const guessedMarker = new google.maps.marker.AdvancedMarkerElement({
          map: resultMapRef.current,
          position: guessedLocations[i].position,
          content: guessContainer,
        })

        actualMarkersRef.current.push(actualMarker)
        guessedMarkersRef.current.push(guessedMarker)
      }
    } else {
      const actualContainer = document.createElement('div')
      const actualDiv = createRoot(actualContainer)

      actualDiv.render(
        <ActualMarker roundNumber={round} isFinalResult={false} />,
      )

      const actualLoc = actualLocations[round]

      const actualMarker = new google.maps.marker.AdvancedMarkerElement({
        map: resultMapRef.current,
        position: {
          lat: actualLoc.lat,
          lng: actualLoc.lng,
        },
        content: actualContainer,
      })

      actualMarker.addListener('click', () => {
        window.open(
          `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${actualLoc.lat},${actualLoc.lng}&heading=${actualLoc.heading}&pitch=${actualLoc.pitch}&fov=180&pano=${actualLoc.panoId}`,
          '_blank',
        )
      })

      const guessContainer = document.createElement('div')
      const guessDiv = createRoot(guessContainer)

      guessDiv.render(<GuessMarker />)

      const guessedMarker = new google.maps.marker.AdvancedMarkerElement({
        map: resultMapRef.current,
        position: guessedLocations[round].position,
        content: guessContainer,
      })

      actualMarkersRef.current.push(actualMarker)
      guessedMarkersRef.current.push(guessedMarker)
    }
  }

  const renderPolylines = () => {
    for (const polyline of polylinesRef.current) {
      polyline.setMap(null)
    }

    polylinesRef.current = []

    if (view === 'finalResult') {
      for (let i = 0; i < actualLocations.length; i++) {
        const actualLoc = actualLocations[i]
        const guessLoc = guessedLocations[i].position

        const polyline = new google.maps.Polyline({
          ...polylineOptions,
          map: resultMapRef.current,
          path: [
            {
              lat: actualLoc.lat,
              lng: actualLoc.lng,
            },
            ...(guessLoc !== null ? [guessLoc] : []),
          ],
        })

        polylinesRef.current.push(polyline)
      }
    } else {
      const actualLoc = actualLocations[round]
      const guessLoc = guessedLocations[round].position

      const polyline = new google.maps.Polyline({
        ...polylineOptions,
        map: resultMapRef.current,
        path: [
          {
            lat: actualLoc.lat,
            lng: actualLoc.lng,
          },
          ...(guessLoc !== null ? [guessLoc] : []),
        ],
      })

      polylinesRef.current.push(polyline)
    }
  }

  useEffect(() => {
    if (!isGoogleLoaded) return
    if (guessedLocations.length === 0) return
    if (!(view === 'result' || view === 'finalResult')) return

    renderMarkers()
    renderPolylines()
    fitMapBounds()
  }, [isGoogleLoaded, actualLocations, guessedLocations, view])

  return (
    <GoogleMap
      defaultOptions={{
        clickableIcons: false,
        disableDefaultUI: true,
        gestureHandling: 'greedy',
        zoomControl: true,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP,
        minZoom: 1,
      }}
      onLoaded={(map) => {
        resultMapRef.current = map
      }}
      className={styles['result-map']}
    />
  )
}

export default ResultMap
