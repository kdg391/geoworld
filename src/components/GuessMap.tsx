import React, { useEffect, useRef } from 'react'

import GoogleMap from './GoogleMap.js'

import COUNTRY_BOUNDS, {
    type CountryCodes,
} from '../utils/constants/countryBounds.js'
import { DEFAULT_OPTIONS, type GameData } from '../utils/constants/index.js'

interface Props {
    googleApiLoaded: boolean
    code: CountryCodes | undefined
    data: GameData
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

const GuessMap: React.FC<
    Props &
        React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLDivElement>,
            HTMLDivElement
        >
> = ({
    googleApiLoaded,
    code,
    data,
    markerPosition,
    round,
    setMarkerPosition,
    ...props
}) => {
    const guessMapRef = useRef<google.maps.Map | null>(null)

    const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
        null,
    )

    const fitMapBounds = () => {
        if (!guessMapRef.current) return

        if (code !== undefined && code in COUNTRY_BOUNDS) {
            const [lng1, lat1, lng2, lat2] = COUNTRY_BOUNDS[code]

            const bounds = new google.maps.LatLngBounds()

            bounds.extend(new google.maps.LatLng(lat1, lng1))
            bounds.extend(new google.maps.LatLng(lat2, lng2))

            guessMapRef.current.fitBounds(bounds)
            guessMapRef.current.setCenter(bounds.getCenter())
        } else {
            guessMapRef.current.setCenter(
                DEFAULT_OPTIONS.center as google.maps.LatLngLiteral,
            )
            guessMapRef.current.setZoom(1)
        }
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
        <GoogleMap
            googleApiLoaded={googleApiLoaded}
            defaultOptions={{
                disableDefaultUI: true,
                zoomControl: true,
                clickableIcons: false,
                fullscreenControl: true,
                draggableCursor: 'crosshair',
                mapId: import.meta.env.VITE_GOOGLE_MAPS_1,
                ...DEFAULT_OPTIONS,
                ...data.defaultOptions,
            }}
            onMount={(map) => {
                guessMapRef.current = map

                map.addListener('click', (event: google.maps.MapMouseEvent) => {
                    setMarkerPosition(event.latLng?.toJSON() ?? null)

                    if (markerRef.current) {
                        markerRef.current.position = event.latLng
                    }
                })
            }}
            {...props}
        />
    )
}

export default GuessMap
