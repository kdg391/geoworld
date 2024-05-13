import React, { useEffect, useRef } from 'react'

interface Props {
    defaultOptions?: google.maps.MapOptions
    onMount: (map: google.maps.Map) => void
}

const Map: React.FC<
    Props &
        React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLDivElement>,
            HTMLDivElement
        >
> = ({ defaultOptions, onMount, ...props }) => {
    const mapElRef = useRef<HTMLDivElement | null>(null)
    const mapRef = useRef<google.maps.Map | null>(null)

    useEffect(() => {
        if (!window.google) return
        if (!window.google.maps.Map) return

        const map = new google.maps.Map(mapElRef.current!, defaultOptions)

        onMount(map)

        mapRef.current = map
    }, [])

    return <div ref={mapElRef} {...props}></div>
}

export default Map
