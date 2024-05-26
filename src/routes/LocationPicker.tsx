import { Loader } from '@googlemaps/js-api-loader'
import { useEffect, useRef, useState } from 'react'

import styles from './LocationPicker.module.css'

const LocationPicker = () => {
    const [position, setPosition] = useState<google.maps.LatLngLiteral | null>(
        null,
    )

    const mapElRef = useRef<HTMLDivElement | null>(null)
    const svPanoramaElRef = useRef<HTMLDivElement | null>(null)

    const mapRef = useRef<google.maps.Map | null>(null)
    const svPanoramaRef = useRef<google.maps.StreetViewPanorama | null>(null)
    const svServiceRef = useRef<google.maps.StreetViewService | null>(null)

    const init = async () => {
        const loader = new Loader({
            apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
            version: 'weekly',
        })

        await loader.importLibrary('maps')
        await loader.importLibrary('streetView')

        const map = new google.maps.Map(mapElRef.current!, {
            center: {
                lat: 36.629169,
                lng: 127.939914,
            },
            zoom: 8,
            zoomControl: true,
            streetViewControl: true,
            scrollwheel: true,
            clickableIcons: false,
            draggableCursor: 'crosshair',
        })

        const svPanorama = new google.maps.StreetViewPanorama(
            svPanoramaElRef.current as HTMLDivElement,
        )

        map.setStreetView(svPanorama)

        const svService = new google.maps.StreetViewService()

        const svLayer = new google.maps.StreetViewCoverageLayer()
        svLayer.setMap(map)

        mapRef.current = map
        svPanoramaRef.current = svPanorama
        svServiceRef.current = svService

        map.addListener('click', (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
                loadPanorama(event.latLng.toJSON())
            }
        })

        svPanorama.addListener('position_changed', () => {
            const position = svPanorama.getPosition()

            if (!position) return

            setPosition(position.toJSON())
        })
    }

    const loadPanorama = (location: google.maps.LatLngLiteral) => {
        if (!svPanoramaRef.current) return
        if (!svServiceRef.current) return

        svServiceRef.current
            .getPanorama({
                location,
            })
            .then(({ data }) => {
                if (data.location)
                    svPanoramaRef.current?.setPano(data.location.pano)
            })
            .catch(console.error)
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <main className={styles.main}>
            <div>
                <pre>
                    <code>{JSON.stringify(position)}</code>
                </pre>
                <button
                    onClick={async () => {
                        await navigator.clipboard.writeText(
                            JSON.stringify(position, null, '\t'),
                        )

                        alert('Copied completely')
                    }}
                >
                    Copy
                </button>
            </div>
            <div className={styles.container}>
                <div ref={mapElRef} className={styles.map}></div>
                <div ref={svPanoramaElRef} className={styles.pano}></div>
            </div>
        </main>
    )
}

export default LocationPicker
