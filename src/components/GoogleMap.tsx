import React, { useEffect, useRef } from 'react'

interface Props {
    googleApiLoaded: boolean
    defaultOptions?: google.maps.MapOptions
    onMount: (map: google.maps.Map) => void
}

const GoogleMap: React.FC<
    Props &
        React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLDivElement>,
            HTMLDivElement
        >
> = ({ googleApiLoaded, defaultOptions, onMount, ...props }) => {
    const mapElRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!googleApiLoaded) return

        const map = new google.maps.Map(
            mapElRef.current as HTMLDivElement,
            defaultOptions,
        )

        onMount(map)
    }, [googleApiLoaded])

    return <div ref={mapElRef} {...props}></div>
}

export default GoogleMap
