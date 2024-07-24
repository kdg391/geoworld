'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'

import useGoogleApi from '../../hooks/useGoogleApi.js'

import styles from './index.module.css'

import type { ControlSettings, GameView } from '../../types/index.js'

const StreetViewControls = dynamic(
  () => import('../StreetViewControls/index.js'),
)

interface Props {
  location: google.maps.LatLngLiteral
  settings: ControlSettings
  view: GameView | null
}

const StreetView = ({ location, settings, view }: Props) => {
  const svPanoramaElRef = useRef<HTMLDivElement | null>(null)

  const svPanoramaRef = useRef<google.maps.StreetViewPanorama | null>(null)
  const svServiceRef = useRef<google.maps.StreetViewService | null>(null)

  const positionHistoryRef = useRef<google.maps.LatLngLiteral[]>([])

  const { isLoaded } = useGoogleApi()

  const init = () => {
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

      const compareLocs = (
        l1?: google.maps.LatLngLiteral,
        l2?: google.maps.LatLngLiteral,
      ) => {
        if (!l1 || !l2) return false

        return l1.lat === l2.lat && l1.lng === l2.lng
      }

      if (
        positionHistoryRef.current.length < 1 ||
        !compareLocs(
          position,
          positionHistoryRef.current[positionHistoryRef.current.length - 1],
        )
      )
        positionHistoryRef.current.push(position)
    })

    loadPanorama()

    setTimeout(() => {
      if (settings.canPan) return

      if (document.querySelector('.widget-scene')) {
        const widgetScene = document.querySelector('.widget-scene') as Element

        const disablePan = (event: Event) => {
          event.stopPropagation()
        }

        widgetScene.addEventListener('mousedown', disablePan)
        widgetScene.addEventListener('touchstart', disablePan)
        widgetScene.addEventListener('pointerdown', disablePan)
      }
    }, 500)
  }

  const loadPanorama = () => {
    if (!svPanoramaRef.current) return
    if (!svServiceRef.current) return

    if (!location) return

    svServiceRef.current
      .getPanorama({
        location,
      })
      .then(({ data }) => {
        if (data.location) {
          svPanoramaRef.current?.setPano(data.location.pano)
          svPanoramaRef.current?.setPov({
            heading: 0,
            pitch: 0,
          })
          svPanoramaRef.current?.setZoom(0)

          positionHistoryRef.current = []
        }
      })
      .catch(console.error)
  }

  const onReturnToStartClick = () => {
    if (!svPanoramaRef.current) return

    svPanoramaRef.current.setPosition(location)
  }

  const onUndoClick = () => {
    if (!svPanoramaRef.current) return

    if (positionHistoryRef.current.length > 1) {
      positionHistoryRef.current.pop()

      svPanoramaRef.current.setPosition(
        positionHistoryRef.current[positionHistoryRef.current.length - 1],
      )
    }
  }

  useEffect(() => {
    if (!isLoaded) return

    init()
  }, [isLoaded])

  useEffect(() => {
    if (view !== 'game') return

    loadPanorama()
  }, [view])

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
