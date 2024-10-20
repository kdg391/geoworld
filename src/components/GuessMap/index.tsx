'use client'

import { Map as MapIcon, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import { DEFAULT_MAP_CENTER, OFFICIAL_MAP_WORLD_ID } from '@/constants/index.js'

import { useTranslation } from '@/i18n/client.js'

import { classNames } from '@/utils/index.js'

import Button from '../common/Button/index.js'

import styles from './index.module.css'

import type { GameView, Map } from '@/types/index.js'

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

  const [mapSize, setMapSize] = useLocalStorage('mapSize', 1)
  const [isMapPinned, setIsMapPinned] = useLocalStorage('isMapPinned', false)
  const [isMapActive, setIsMapActive] = useState(isMapPinned)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const { t } = useTranslation('game')

  const fitMapBounds = () => {
    if (!guessMapRef.current) return

    if (mapData.id !== OFFICIAL_MAP_WORLD_ID && mapData.bounds !== null) {
      const { min, max } = mapData.bounds

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

  const onGuessClick = async () => {
    setIsLoading(true)

    await finishRound(false)

    setIsLoading(false)
  }

  useEffect(() => {
    if (!guessMapRef.current) return

    fitMapBounds()

    setIsMobileOpen(false)

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
          isMapActive ? 'active' : '',
          isMobileOpen ? 'mobile-open' : '',
          mapSize !== 1 ? `size--${mapSize}` : '',
        )}
        onMouseOver={() => {
          if (isMapPinned) return
          if (window.innerWidth <= 640) return

          setIsMapActive(true)
        }}
        onMouseLeave={() => {
          if (isMapPinned) return
          if (window.innerWidth <= 640) return

          setIsMapActive(false)
        }}
      >
        <button
          className={styles['close-btn']}
          aria-label={t('guess_map.close_map')}
          onClick={() => setIsMobileOpen(false)}
        >
          <X />
        </button>

        <GuessMapControls
          isMapPinned={isMapPinned}
          setIsMapPinned={setIsMapPinned}
          mapSize={mapSize}
          setMapSize={setMapSize}
        />

        <div className={styles['guess-map-wrapper']}>
          <GoogleMap
            defaultOptions={{
              clickableIcons: false,
              disableDefaultUI: true,
              draggableCursor: 'crosshair',
              fullscreenControl: false,
              mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP,
              zoomControl: false,
            }}
            onLoaded={(map) => init(map)}
            className={styles['guess-map']}
          />

          <GuessMapZoomControls map={guessMapRef.current} />
        </div>

        <Button
          full
          isLoading={isLoading}
          disabled={markerPosition === null || isLoading}
          className={styles['guess-btn']}
          onClick={onGuessClick}
        >
          Guess
        </Button>
      </div>

      <button
        className={styles['map-btn']}
        aria-label={t('guess_map.open_map')}
        onClick={() => setIsMobileOpen(true)}
      >
        <MapIcon size={24} />
      </button>
    </>
  )
}

export default GuessMap
