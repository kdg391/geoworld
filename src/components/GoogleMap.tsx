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
    // const mapRef = useRef<google.maps.Map | null>(null)

    useEffect(() => {
        if (!googleApiLoaded) return

        const map = new google.maps.Map(
            mapElRef.current as HTMLDivElement,
            defaultOptions,
        )

        // mapRef.current = map

        onMount(map)
    }, [googleApiLoaded])

    /*
    useEffect(() => {
        if (!props.children) return
        if (!mapRef.current) return

        React.Children.map(props.children, (child, index) => {
            const marker = new google.maps.marker.AdvancedMarkerElement({
                map: mapRef.current,
            })
            return <React.Fragment key={index} />
        })

        return () => {}
    }, [props.children, mapRef.current])
    */

    return <div ref={mapElRef} {...props}></div>
}

export default GoogleMap
