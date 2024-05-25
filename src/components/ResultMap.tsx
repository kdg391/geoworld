import React, { useEffect, useRef, useState } from 'react'

import GoogleMap from './GoogleMap.js'
import Marker from './Marker.js'

interface Props {
    googleApiLoaded: boolean
    actualLocations: google.maps.LatLngLiteral[]
    gameFinished: boolean
    guessedLocations: google.maps.LatLngLiteral[]
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
    gameFinished,
    guessedLocations,
    round,
    roundFinished,
    ...props
}) => {
    const resultMapRef = useRef<google.maps.Map | null>(null)

    const [actualMarkers, setActualMarkers] = useState<
        google.maps.marker.AdvancedMarkerElement[]
    >([])
    const [guessedMarkers, setGuessedMarkers] = useState<
        google.maps.marker.AdvancedMarkerElement[]
    >([])
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

                const guessed = new google.maps.marker.AdvancedMarkerElement({
                    map: resultMapRef.current,
                    position: guessedLocations[i],
                })

                setActualMarkers((markers) => [...markers, actual])
                setGuessedMarkers((markers) => [...markers, guessed])
            }
        } else {
            const actual = new google.maps.marker.AdvancedMarkerElement({
                map: resultMapRef.current,
                position: actualLocations[round],
                content: pinElement.element,
            })

            const guessed = new google.maps.marker.AdvancedMarkerElement({
                map: resultMapRef.current,
                position: guessedLocations[round],
            })

            setActualMarkers((markers) => [...markers, actual])
            setGuessedMarkers((markers) => [...markers, guessed])
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

        if (gameFinished) {
            for (let i = 0; i < actualLocations.length; i++) {
                const polyline = new google.maps.Polyline({
                    ...polylineOptions,
                    path: [actualLocations[i], guessedLocations[i]],
                })

                polylinesRef.current.push(polyline)
            }
        } else {
            const polyline = new google.maps.Polyline({
                ...polylineOptions,
                path: [actualLocations[round], guessedLocations[round]],
            })

            polylinesRef.current.push(polyline)
        }
    }

    const updateMap = () => {
        setActualMarkers((markers) => {
            for (const marker of markers) {
                marker.map = null
            }

            return markers
        })

        setGuessedMarkers((markers) => {
            for (const marker of markers) {
                marker.map = null
            }

            return markers
        })

        setActualMarkers([])
        setGuessedMarkers([])

        for (const polyline of polylinesRef.current) {
            polyline.setMap(null)
        }

        polylinesRef.current = []

        renderMarkers()
        renderPolylines()
        fitMapBounds()
    }

    useEffect(() => {
        if (!roundFinished) return

        updateMap()
    }, [roundFinished])

    useEffect(() => {
        if (!gameFinished) return

        updateMap()
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
        >
            {actualMarkers.map((marker, index) => (
                <Marker
                    key={index}
                    position={marker.position!}
                    options={{
                        map: resultMapRef.current,
                    }}
                />
            ))}
            {guessedMarkers.map((marker, index) => (
                <Marker
                    key={index}
                    position={marker.position!}
                    options={{
                        map: resultMapRef.current,
                    }}
                />
            ))}
        </GoogleMap>
    )
}

export default ResultMap
