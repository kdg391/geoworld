import { Map, X } from 'lucide-react'
import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import COUNTRY_BOUNDS from '../constants/country-bounds.json'
import { DEFAULT_MAP_OPTIONS } from '../constants/index.js'

import useGoogleApi from '../hooks/useGoogleApi.js'

import { classNames } from '../utils/index.js'

import styles from './GuessMap.module.css'

import type GoogleMapType from './GoogleMap.js'
import type { CountryCodes } from '../types/index.js'

const GoogleMap = lazy(() => import('./GoogleMap.js')) as typeof GoogleMapType
const GuessMapControls = lazy(() => import('./GuessMapControls.js'))
const GuessMapZoomControls = lazy(() => import('./GuessMapZoomControls.js'))

interface Props {
    code: CountryCodes | undefined
    finishRound: (timedOut: boolean) => void
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
    code,
    finishRound,
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

    const { isLoaded } = useGoogleApi()

    const { t } = useTranslation()

    const fitMapBounds = () => {
        if (!guessMapRef.current) return

        if (code !== undefined && code in COUNTRY_BOUNDS) {
            // eslint-disable-next-line
            // @ts-ignore
            const { min, max } = COUNTRY_BOUNDS[code]

            const bounds = new google.maps.LatLngBounds()

            bounds.extend(min)
            bounds.extend(max)

            guessMapRef.current.fitBounds(bounds)
            guessMapRef.current.setCenter(bounds.getCenter())
        } else {
            guessMapRef.current.setCenter(
                DEFAULT_MAP_OPTIONS.center as
                    | google.maps.LatLngLiteral
                    | google.maps.LatLng,
            )
            guessMapRef.current.setZoom(1)
        }
    }

    useEffect(() => {
        if (!isLoaded) return

        const marker = new google.maps.marker.AdvancedMarkerElement({
            map: guessMapRef.current,
        })

        markerRef.current = marker

        fitMapBounds()
    }, [isLoaded])

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
                className={classNames(
                    styles['guess-map-container'],
                    mapActive ? 'active' : '',
                    mapSize !== 1 ? `size--${mapSize}` : '',
                )}
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
                    className={styles['close-btn']}
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

                <div className={styles['guess-map-wrapper']}>
                    <Suspense>
                        <GoogleMap
                            defaultOptions={{
                                clickableIcons: false,
                                disableDefaultUI: true,
                                draggableCursor: 'crosshair',
                                fullscreenControl: false,
                                mapId: import.meta.env.VITE_GOOGLE_MAPS_GUESS,
                                zoomControl: false,
                            }}
                            onLoaded={(map) => {
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
                            className={styles['guess-map']}
                        />
                    </Suspense>
                    <Suspense>
                        <GuessMapZoomControls map={guessMapRef.current} />
                    </Suspense>
                </div>

                <button
                    className={styles['guess-btn']}
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
                className={styles['map-btn']}
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
