import React, { lazy, Suspense, useEffect, useRef } from 'react'

import styles from './StreetView.module.css'

const StreetViewControls = lazy(() => import('./StreetViewControls.js'))

interface GameSettings {
    canMove: boolean
    canPan: boolean
    canZoom: boolean
}

interface Props {
    googleApiLoaded: boolean
    location: google.maps.LatLngLiteral
    settings: GameSettings
}

const StreetView: React.FC<Props> = ({
    googleApiLoaded,
    location,
    settings,
}) => {
    const svPanoramaElRef = useRef<HTMLDivElement | null>(null)

    const svPanoramaRef = useRef<google.maps.StreetViewPanorama | null>(null)
    const svServiceRef = useRef<google.maps.StreetViewService | null>(null)

    const positionHistoryRef = useRef<google.maps.LatLngLiteral[]>([])

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
                    positionHistoryRef.current[
                        positionHistoryRef.current.length - 1
                    ],
                )
            )
                positionHistoryRef.current.push(position)
        })

        const disablePan = (event: Event) => {
            event.stopPropagation()
        }

        setTimeout(() => {
            if (settings.canPan) return

            if (document.querySelector('.widget-scene')) {
                const widgetScene = document.querySelector(
                    '.widget-scene',
                ) as Element

                widgetScene.addEventListener('mousedown', disablePan)
                widgetScene.addEventListener('touchstart', disablePan)
                widgetScene.addEventListener('pointerdown', disablePan)
            }
        }, 500)
    }

    const loadPanorama = () => {
        if (!svPanoramaRef.current) return
        if (!svServiceRef.current) return

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
                positionHistoryRef.current[
                    positionHistoryRef.current.length - 1
                ],
            )
        }
    }

    useEffect(() => {
        if (!googleApiLoaded) return

        init()
    }, [googleApiLoaded])

    useEffect(() => {
        loadPanorama()
    }, [location])

    return (
        <>
            {settings.canMove && (
                <Suspense>
                    <StreetViewControls
                        canPan={settings.canPan}
                        onReturnToStartClick={onReturnToStartClick}
                        onUndoClick={onUndoClick}
                    />
                </Suspense>
            )}
            <div ref={svPanoramaElRef} className={styles.streetView}></div>
        </>
    )
}

export default StreetView
