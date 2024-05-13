import React, { useEffect, useRef } from 'react'

import styles from './StreetView.module.css'
import StreetViewControls from './StreetViewControls'

interface GameSettings {
    canMove: boolean
    canPan: boolean
    canZoom: boolean
}

interface Props {
    location: google.maps.LatLngLiteral
    settings: GameSettings
}

const StreetView: React.FC<Props> = ({ location, settings }) => {
    const svPanoramaElRef = useRef<HTMLDivElement | null>(null)

    const svPanoramaRef = useRef<google.maps.StreetViewPanorama | null>(null)
    const svServiceRef = useRef<google.maps.StreetViewService | null>(null)

    const positionHistoryRef = useRef<google.maps.LatLngLiteral[]>([])

    const loadPanorama = () => {
        if (!svPanoramaRef.current) return
        if (!svServiceRef.current) return

        svServiceRef.current
            .getPanorama({
                location,
            })
            .then(({ data }) => {
                if (data.location !== undefined) {
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
        if (!window.google) return

        const init = async () => {
            const { ControlPosition } = (await google.maps.importLibrary(
                'core',
            )) as google.maps.CoreLibrary
            const { StreetViewPanorama, StreetViewService } =
                (await google.maps.importLibrary(
                    'streetView',
                )) as google.maps.StreetViewLibrary

            const svPanorama = new StreetViewPanorama(
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
                        position: ControlPosition.LEFT_BOTTOM,
                    },
                    scrollwheel: settings.canZoom,
                    showRoadLabels: false,
                },
            )

            const svService = new StreetViewService()

            svPanoramaRef.current = svPanorama
            svServiceRef.current = svService
        }

        init()
    }, [])

    useEffect(() => {
        loadPanorama()
    }, [location])

    useEffect(() => {
        if (!svPanoramaRef.current) return

        const positionChangeEvent = svPanoramaRef.current.addListener(
            'position_changed',
            () => {
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
            },
        )

        return () => {
            positionChangeEvent.remove()
        }
    }, [svPanoramaRef.current])

    return (
        <>
            {settings.canMove && (
                <StreetViewControls
                    onReturnToStartClick={onReturnToStartClick}
                    onUndoClick={onUndoClick}
                />
            )}
            <div ref={svPanoramaElRef} className={styles.streetView}></div>
        </>
    )
}

export default StreetView