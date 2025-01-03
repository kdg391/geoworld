'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

import useGoogleApi from '@/hooks/useGoogleApi.js'

import styles from './index.module.css'

import type { ControlSettings, GameView } from '@/types/game.js'
import type { RoundLocation } from '@/types/location.js'

const StreetViewControls = dynamic(
  () => import('../StreetViewControls/index.js'),
)

interface Props {
  location: RoundLocation
  settings: ControlSettings
  view: GameView | null
}

const StreetView = ({ location, settings, view }: Props) => {
  const svPanoramaElRef = useRef<HTMLDivElement | null>(null)

  const svPanoramaRef = useRef<google.maps.StreetViewPanorama | null>(null)
  const svServiceRef = useRef<google.maps.StreetViewService | null>(null)

  const posHistoryRef = useRef<google.maps.LatLngLiteral[]>([])

  const [isLoading, setIsLoading] = useState(true)

  const { isGoogleApiLoaded } = useGoogleApi()

  const init = async () => {
    const svPanorama = new google.maps.StreetViewPanorama(
      svPanoramaElRef.current as HTMLDivElement,
      {
        addressControl: false,
        clickToGo: settings.canMove,
        disableDefaultUI: true,
        disableDoubleClickZoom: !settings.canZoom,
        linksControl: settings.canMove,
        motionTracking: false,
        panControl: settings.canPan,
        panControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM,
        },
        scrollwheel: settings.canZoom,
        showRoadLabels: false,
      },
    )

    const svService = new google.maps.StreetViewService()

    svPanoramaRef.current = svPanorama
    svServiceRef.current = svService

    svPanorama.addListener('position_changed', () => {
      const pos = svPanoramaRef.current?.getPosition()

      if (!pos) return

      const position = pos.toJSON()
      const lastPosition =
        posHistoryRef.current[posHistoryRef.current.length - 1]

      if (
        posHistoryRef.current.length < 1 ||
        !(
          position.lat === lastPosition?.lat &&
          position.lng === lastPosition?.lng
        )
      )
        posHistoryRef.current.push(position)
    })

    await loadPanorama()
  }

  const loadPanorama = async () => {
    if (!svPanoramaRef.current) return
    if (!svServiceRef.current) return

    if (!location) return

    setIsLoading(true)

    let res: google.maps.StreetViewResponse

    try {
      res = await svServiceRef.current.getPanorama({
        location: {
          lat: location.lat,
          lng: location.lng,
        },
      })
    } catch (err) {
      console.error(err)

      return
    }

    const { data } = res

    if (!data.location) return

    const heading =
      location.heading === 0 ? (data.links?.[0].heading ?? 0) : location.heading

    svPanoramaRef.current?.setPano(data.location.pano)
    svPanoramaRef.current?.setPov({
      heading,
      pitch: location.pitch,
    })
    svPanoramaRef.current?.setZoom(location.zoom)

    posHistoryRef.current = []

    setIsLoading(false)
  }

  const onReturnToStartClick = () => {
    if (!svPanoramaRef.current) return

    svPanoramaRef.current.setPosition(location)
  }

  const onUndoClick = () => {
    if (!svPanoramaRef.current) return

    if (posHistoryRef.current.length > 1) {
      posHistoryRef.current.pop()

      svPanoramaRef.current.setPosition(
        posHistoryRef.current[posHistoryRef.current.length - 1],
      )
    }
  }

  useEffect(() => {
    if (!isGoogleApiLoaded) return

    init()
  }, [isGoogleApiLoaded])

  useEffect(() => {
    if (view !== 'game') return

    loadPanorama()
  }, [view])

  useEffect(() => {
    if (settings.canPan) return
    if (view !== 'game') return
    if (isLoading) return

    const disablePan = (event: Event) => event.stopPropagation()

    const widgetScene = document.querySelector('.widget-scene')

    widgetScene?.addEventListener('mousedown', disablePan)
    widgetScene?.addEventListener('touchstart', disablePan)
    widgetScene?.addEventListener('pointerdown', disablePan)

    return () => {
      widgetScene?.removeEventListener('mousedown', disablePan)
      widgetScene?.removeEventListener('touchstart', disablePan)
      widgetScene?.removeEventListener('pointerdown', disablePan)
    }
  }, [settings.canPan, view, isLoading])

  return (
    <div>
      {settings.canMove && (
        <StreetViewControls
          canPan={settings.canPan}
          onReturnToStartClick={onReturnToStartClick}
          onUndoClick={onUndoClick}
        />
      )}
      <div ref={svPanoramaElRef} className={styles['street-view']}></div>
    </div>
  )
}

export default StreetView
