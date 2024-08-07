'use client'

import { Map as MapIcon, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

import COUNTRY_BOUNDS from '../../constants/country-bounds.json' with { type: 'json' }
import {
  DEFAULT_MAP_CENTER,
  OFFICIAL_MAP_WORLD_ID,
  OFFICIAL_MAP_COUNTRY_CODES,
} from '../../constants/index.js'

import { useTranslation } from '../../i18n/client.js'

import { classNames } from '../../utils/index.js'

import styles from './index.module.css'

import type { GameView, Map } from '../../types/index.js'

const GoogleMap = dynamic(() => import('../GoogleMap.js'))
const GuessMapControls = dynamic(() => import('../GuessMapControls/index.js'))
const GuessMapZoomControls = dynamic(
  () => import('../GuessMapZoomControls/index.js'),
)

interface Props {
  finishRound: (timedOut: boolean) => Promise<void>
  mapData: Map
  markerPosition: google.maps.LatLngLiteral | null
  setMarkerPosition: React.Dispatch<
    React.SetStateAction<google.maps.LatLngLiteral | null>
  >
  round: number
  view: GameView | null
}

const GuessMap = ({
  finishRound,
  mapData,
  markerPosition,
  setMarkerPosition,
  round,
}: Props) => {
  const guessMapRef = useRef<google.maps.Map | null>(null)

  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null,
  )

  const [mapSize, setMapSize] = useState(1)
  const [isMapPinned, setIsMapPinned] = useState(false)
  const [mapActive, setMapActive] = useState(false)

  const { t } = useTranslation('game')

  const fitMapBounds = () => {
    if (!guessMapRef.current) return

    if (mapData.id !== OFFICIAL_MAP_WORLD_ID) {
      const { min, max } =
        mapData.type === 'official' &&
        OFFICIAL_MAP_COUNTRY_CODES[mapData.id] in COUNTRY_BOUNDS
          ? // @ts-ignore
            COUNTRY_BOUNDS[OFFICIAL_MAP_COUNTRY_CODES[mapData.id]]
          : mapData.bounds

      const latLngBounds = new google.maps.LatLngBounds()

      latLngBounds.extend(min)
      latLngBounds.extend(max)

      guessMapRef.current.fitBounds(latLngBounds)
      guessMapRef.current.setCenter(latLngBounds.getCenter())
    } else {
      guessMapRef.current.setCenter(DEFAULT_MAP_CENTER)
      guessMapRef.current.setZoom(1)
    }
  }

  const init = (map: google.maps.Map) => {
    guessMapRef.current = map

    map.addListener('click', (event: google.maps.MapMouseEvent) => {
      setMarkerPosition(event.latLng?.toJSON() ?? null)

      if (markerRef.current) {
        markerRef.current.position = event.latLng
      }
    })

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
    })

    markerRef.current = marker

    fitMapBounds()
  }

  useEffect(() => {
    if (!guessMapRef.current) return

    fitMapBounds()

    if (markerRef.current) {
      markerRef.current.position = null

      setMarkerPosition(null)
    }
  }, [round])

  return (
    <>
      <div
        className={classNames(
          styles['guess-map-container'],
          mapActive ? 'active' : '',
          mapSize !== 1 ? `size--${mapSize}` : '',
        )}
        onMouseOver={() => {
          if (isMapPinned) return
          if (window.innerWidth <= 640) return

          setMapActive(true)
        }}
        onMouseLeave={() => {
          if (isMapPinned) return
          if (window.innerWidth <= 640) return

          setMapActive(false)
        }}
      >
        <button
          className={styles['close-btn']}
          aria-label={t('guessMap.closeMap')}
          onClick={() => setMapActive(false)}
        >
          <X />
        </button>

        <GuessMapControls
          isMapPinned={isMapPinned}
          mapSize={mapSize}
          setIsMapPinned={setIsMapPinned}
          setMapSize={setMapSize}
        />

        <div className={styles['guess-map-wrapper']}>
          <GoogleMap
            defaultOptions={{
              clickableIcons: false,
              disableDefaultUI: true,
              draggableCursor: 'crosshair',
              fullscreenControl: false,
              mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_RESULT,
              zoomControl: false,
            }}
            onLoaded={(map) => init(map)}
            className={styles['guess-map']}
          />

          <GuessMapZoomControls map={guessMapRef.current} />
        </div>

        <button
          className={styles['guess-btn']}
          aria-label="Guess"
          disabled={markerPosition === null}
          onClick={() => finishRound(false)}
        >
          Guess
        </button>
      </div>

      <button
        className={styles['map-btn']}
        aria-label={t('guessMap.openMap')}
        onClick={() => setMapActive(true)}
      >
        <MapIcon size={24} />
      </button>
    </>
  )
}

export default GuessMap
