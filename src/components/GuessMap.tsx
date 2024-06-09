import { Map, X } from 'lucide-react'
import React, { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

// import COUNTRY_BOUNDS from '../constants/countryBounds.js'
import { DEFAULT_MAP_OPTIONS, type Codes } from '../constants/index.js'

import styles from './GuessMap.module.css'

import type GoogleMapType from './GoogleMap.js'

const GoogleMap = lazy(() => import('./GoogleMap.js')) as typeof GoogleMapType
const GuessMapControls = lazy(() => import('./GuessMapControls.js'))
const GuessMapZoomControls = lazy(() => import('./GuessMapZoomControls.js'))

interface Props {
    code: Codes | undefined
    finishRound: (timedOut: boolean) => void
    googleApiLoaded: boolean
    markerPosition:
        | google.maps.LatLngLiteral
        | google.maps.LatLngAltitudeLiteral
        | null
    round: number
    setMarkerPosition: React.Dispatch<
        React.SetStateAction<
            google.maps.LatLngLiteral | google.maps.LatLngAltitudeLiteral | null
        >
    >
}

const GuessMap: React.FC<Props> = ({
    // code,
    finishRound,
    googleApiLoaded,
    markerPosition,
    round,
    setMarkerPosition,
}) => {
    const guessMapRef = useRef<google.maps.Map | null>(null)

    const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
        null,
    )

    const [mapSize, setMapSize] = useState(1)
    const [isMapPinned, setIsMapPinned] = useState(false)
    const [mapActive, setMapActive] = useState(false)

    const { t } = useTranslation()

    const fitMapBounds = () => {
        if (!guessMapRef.current) return

        /*if (code !== undefined && code in COUNTRY_BOUNDS) {
            const [lng1, lat1, lng2, lat2] = COUNTRY_BOUNDS[code]

            const bounds = new google.maps.LatLngBounds()

            bounds.extend(new google.maps.LatLng(lat1, lng1))
            bounds.extend(new google.maps.LatLng(lat2, lng2))

            guessMapRef.current.fitBounds(bounds)
            guessMapRef.current.setCenter(bounds.getCenter())
        } else {*/
        guessMapRef.current.setCenter(
            DEFAULT_MAP_OPTIONS.center as
                | google.maps.LatLngLiteral
                | google.maps.LatLng,
        )
        guessMapRef.current.setZoom(1)
        // }
    }

    useEffect(() => {
        if (!googleApiLoaded) return

        const marker = new google.maps.marker.AdvancedMarkerElement({
            map: guessMapRef.current,
        })

        markerRef.current = marker

        fitMapBounds()
    }, [googleApiLoaded])

    useEffect(() => {
        fitMapBounds()

        if (markerRef.current) {
            markerRef.current.position = null

            setMarkerPosition(null)
        }
    }, [round])

    return (
        <>
            <div
                className={[
                    styles.guessMapContainer,
                    mapActive ? 'active' : '',
                    mapSize !== 1 ? `size--${mapSize}` : '',
                ]
                    .filter((c) => c !== '')
                    .join(' ')}
                onMouseOver={() => {
                    if (isMapPinned) return

                    setMapActive(true)
                }}
                onMouseLeave={() => {
                    if (isMapPinned) return

                    setMapActive(false)
                }}
            >
                <button
                    className={styles.closeBtn}
                    aria-label="Close Map"
                    onClick={() => {
                        setMapActive(false)
                    }}
                >
                    <X />
                </button>

                <Suspense>
                    <GuessMapControls
                        isMapPinned={isMapPinned}
                        mapSize={mapSize}
                        setIsMapPinned={setIsMapPinned}
                        setMapSize={setMapSize}
                    />
                </Suspense>

                <div className={styles.guessMapWrapper}>
                    <Suspense>
                        <GoogleMap
                            googleApiLoaded={googleApiLoaded}
                            defaultOptions={{
                                clickableIcons: false,
                                disableDefaultUI: true,
                                draggableCursor: 'crosshair',
                                fullscreenControl: false,
                                mapId: import.meta.env.VITE_GOOGLE_MAPS_GUESS,
                                zoomControl: false,
                            }}
                            onMount={(map) => {
                                guessMapRef.current = map

                                map.addListener(
                                    'click',
                                    (event: google.maps.MapMouseEvent) => {
                                        setMarkerPosition(
                                            event.latLng?.toJSON() ?? null,
                                        )

                                        if (markerRef.current) {
                                            markerRef.current.position =
                                                event.latLng
                                        }
                                    },
                                )
                            }}
                            className={styles.guessMap}
                        />
                    </Suspense>
                    <Suspense>
                        <GuessMapZoomControls map={guessMapRef.current} />
                    </Suspense>
                </div>

                <button
                    className={styles.guessBtn}
                    aria-label={t('game.guess')}
                    disabled={markerPosition === null}
                    onClick={() => {
                        finishRound(false)
                    }}
                >
                    {t('game.guess')}
                </button>
            </div>

            <button
                className={styles.mapBtn}
                aria-label="Open Map"
                onClick={() => {
                    setMapActive(true)
                }}
            >
                <Map size={24} />
            </button>
        </>
    )
}

export default GuessMap
