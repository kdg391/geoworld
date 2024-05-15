import React, { useEffect, useRef } from 'react'

import GoogleMap from './GoogleMap.js'

interface Props {
    googleApiLoaded: boolean
}

const GuessMap: React.FC<
    Props &
        React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLDivElement>,
            HTMLDivElement
        >
> = ({ googleApiLoaded, ...props }) => {
    const guessMapRef = useRef<google.maps.Map | null>(null)

    useEffect(() => {})

    return (
        <GoogleMap
            googleApiLoaded={googleApiLoaded}
            defaultOptions={{}}
            onMount={(map) => {
                guessMapRef.current = map
            }}
            {...props}
        />
    )
}

export default GuessMap
