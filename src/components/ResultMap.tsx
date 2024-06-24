import { lazy, Suspense, useEffect, useRef } from 'react'

import type GoogleMapType from './GoogleMap.js'

import styles from './ResultMap.module.css'

const GoogleMap = lazy(() => import('./GoogleMap.js')) as typeof GoogleMapType

interface Props {
    actualLocations: google.maps.LatLngLiteral[]
    gameFinished: boolean
    guessedLocations: (google.maps.LatLngLiteral | null)[]
    round: number
    roundFinished: boolean
}

const ResultMap: React.FC<Props> = ({
    actualLocations,
    gameFinished,
    guessedLocations,
    round,
    roundFinished,
}) => {
    const resultMapRef = useRef<google.maps.Map | null>(null)

    const actualMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>(
        [],
    )
    const guessedMarkersRef = useRef<
        google.maps.marker.AdvancedMarkerElement[]
    >([])
    const polylinesRef = useRef<google.maps.Polyline[]>([])

    const fitMapBounds = () => {
        if (!resultMapRef.current) return

        const bounds = new google.maps.LatLngBounds()

        if (gameFinished) {
            for (let i = 0; i < guessedLocations.length; i++) {
                bounds.extend(actualLocations[i])

                const guess = guessedLocations[i]
                if (guess !== null) bounds.extend(guess)
            }
        } else {
            bounds.extend(actualLocations[round])

            const guess = guessedLocations[round]
            if (guess !== null) bounds.extend(guess)
        }

        resultMapRef.current.fitBounds(bounds)
        resultMapRef.current.setCenter(bounds.getCenter())
    }

    const renderMarkers = () => {
        for (const marker of actualMarkersRef.current) {
            marker.position = null
            marker.map = null
        }

        actualMarkersRef.current = []

        for (const marker of guessedMarkersRef.current) {
            marker.position = null
            marker.map = null
        }

        guessedMarkersRef.current = []

        if (gameFinished) {
            for (let i = 0; i < guessedLocations.length; i++) {
                const pinBackground = new google.maps.marker.PinElement({
                    background: '#04d61d',
                })

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

            const actual = new google.maps.marker.AdvancedMarkerElement({
                map: resultMapRef.current,
                position: actualLocations[round],
                content: pinBackground.element,
            })

            const guessed = new google.maps.marker.AdvancedMarkerElement({
                map: resultMapRef.current,
                position: guessedLocations[round],
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

        if (gameFinished) {
            for (let i = 0; i < actualLocations.length; i++) {
                const loc = guessedLocations[i]

                const polyline = new google.maps.Polyline({
                    ...polylineOptions,
                    path: [actualLocations[i], ...(loc !== null ? [loc] : [])],
                })

                polylinesRef.current.push(polyline)
            }
        } else {
            const loc = guessedLocations[round]

            const polyline = new google.maps.Polyline({
                ...polylineOptions,
                path: [actualLocations[round], ...(loc !== null ? [loc] : [])],
            })

            polylinesRef.current.push(polyline)
        }
    }

    useEffect(() => {
        if (!gameFinished) return

        renderMarkers()
        renderPolylines()
        fitMapBounds()
    }, [gameFinished])

    useEffect(() => {
        if (!roundFinished) return

        renderMarkers()
        renderPolylines()
        fitMapBounds()
    }, [roundFinished])

    return (
        <Suspense>
            <GoogleMap
                defaultOptions={{
                    clickableIcons: false,
                    disableDefaultUI: true,
                    gestureHandling: 'greedy',
                    zoomControl: true,
                    mapId: import.meta.env.VITE_GOOGLE_MAPS_RESULT,
                }}
                onLoaded={(map) => {
                    resultMapRef.current = map
                }}
                className={styles['result-map']}
            />
        </Suspense>
    )
}

export default ResultMap
