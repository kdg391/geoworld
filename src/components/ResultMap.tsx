import React, { useEffect, useRef } from 'react'

import GoogleMap from './GoogleMap.js'

interface Props {
    googleApiLoaded: boolean
    actualLocations: google.maps.LatLngLiteral[]
    guessedLocations: google.maps.LatLngLiteral[]
    gameFinished: boolean
    round: number
    roundFinished: boolean
}

const ResultMap: React.FC<
    Props &
        React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLDivElement>,
            HTMLDivElement
        >
> = ({
    googleApiLoaded,
    actualLocations,
    guessedLocations,
    gameFinished,
    round,
    roundFinished,
    ...props
}) => {
    const resultMapRef = useRef<google.maps.Map | null>(null)

    const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([])
    const polylinesRef = useRef<google.maps.Polyline[]>([])

    const fitMapBounds = () => {
        if (!resultMapRef.current) return

        const bounds = new google.maps.LatLngBounds()

        if (gameFinished) {
            for (let i = 0; i < actualLocations.length; i++) {
                bounds.extend(actualLocations[i])
                bounds.extend(guessedLocations[i])
            }
        } else {
            bounds.extend(actualLocations[round])
            bounds.extend(guessedLocations[round])
        }

        resultMapRef.current.fitBounds(bounds)
        resultMapRef.current.setCenter(bounds.getCenter())
    }

    const renderMarkers = () => {
        const pinElement = new google.maps.marker.PinElement({
            background: '#04d61d',
        })

        if (gameFinished) {
            for (let i = 0; i < actualLocations.length; i++) {
                const actual = new google.maps.marker.AdvancedMarkerElement({
                    map: resultMapRef.current,
                    position: actualLocations[i],
                    content: pinElement.element,
                })

                const guess = new google.maps.marker.AdvancedMarkerElement({
                    map: resultMapRef.current,
                    position: guessedLocations[i],
                })

                markersRef.current.push(actual, guess)
            }
        } else {
            const actual = new google.maps.marker.AdvancedMarkerElement({
                map: resultMapRef.current,
                position: actualLocations[round],
                content: pinElement.element,
            })

            const guess = new google.maps.marker.AdvancedMarkerElement({
                map: resultMapRef.current,
                position: guessedLocations[round],
            })

            markersRef.current.push(actual, guess)
        }
    }

    const renderPolylines = () => {
        const lineSymbol = {
            path: 'M 0,-1 0,1',
            strokeOpacity: 1,
            scale: 2,
        }

        if (gameFinished) {
            for (let i = 0; i < actualLocations.length; i++) {
                const polyline = new google.maps.Polyline({
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
                    path: [actualLocations[i], guessedLocations[i]],
                })

                polylinesRef.current.push(polyline)
            }
        } else {
            const polyline = new google.maps.Polyline({
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
                path: [actualLocations[round], guessedLocations[round]],
            })

            polylinesRef.current.push(polyline)
        }
    }

    useEffect(() => {
        console.log(actualLocations, guessedLocations)
    }, [actualLocations, guessedLocations])

    useEffect(() => {
        if (!roundFinished) return

        for (const marker of markersRef.current) {
            marker.map = null
        }

        for (const polyline of polylinesRef.current) {
            polyline.setMap(null)
        }

        renderMarkers()
        renderPolylines()
        fitMapBounds()
    }, [roundFinished])

    useEffect(() => {
        if (!gameFinished) return

        for (const marker of markersRef.current) {
            marker.map = null
        }

        for (const polyline of polylinesRef.current) {
            polyline.setMap(null)
        }

        renderMarkers()
        renderPolylines()
        fitMapBounds()
    }, [gameFinished])

    return (
        <GoogleMap
            googleApiLoaded={googleApiLoaded}
            defaultOptions={{
                disableDefaultUI: true,
                zoomControl: true,
                clickableIcons: false,
                gestureHandling: 'greedy',
                mapId: import.meta.env.VITE_GOOGLE_MAPS_2,
            }}
            onMount={(map) => {
                resultMapRef.current = map
            }}
            {...props}
        />
    )
}

export default ResultMap
