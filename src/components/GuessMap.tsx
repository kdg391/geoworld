import React, { useEffect, useRef } from 'react'

import GoogleMap from './GoogleMap.js'

import { DEFAULT_OPTIONS, type GameData } from '../utils/constants/index.js'

interface Props {
    googleApiLoaded: boolean
    data: GameData
}

const GuessMap: React.FC<
    Props &
        React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLDivElement>,
            HTMLDivElement
        >
> = ({ googleApiLoaded, data, ...props }) => {
    const guessMapRef = useRef<google.maps.Map | null>(null)

    useEffect(() => {
        if (!guessMapRef.current) return
    }, [guessMapRef.current])

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
            }}
            {...props}
        />
    )
}

export default GuessMap
