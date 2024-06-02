import { Loader } from '@googlemaps/js-api-loader'
import { useEffect, useRef, useState } from 'react'

import styles from './RandomStreetView.module.css'

const randomLatLng = (): google.maps.LatLngLiteral => {
    const lat = Math.random() * 180 - 90
    const lng = Math.random() * 360 - 180

    return {
        lat,
        lng,
    }
}

const RandomStreetView = () => {
    const mapElRef = useRef<HTMLDivElement | null>(null)
    const svPanoramaElRef = useRef<HTMLDivElement | null>(null)

    const mapRef = useRef<google.maps.Map | null>(null)
    const svPanoramaRef = useRef<google.maps.StreetViewPanorama | null>(null)
    const svServiceRef = useRef<google.maps.StreetViewService | null>(null)

    const [showMap, setShowMap] = useState(false)

    const init = async () => {
        const loader = new Loader({
            apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
            version: 'weekly',
        })

        await loader.importLibrary('maps')
        await loader.importLibrary('streetView')

        const map = new google.maps.Map(mapElRef.current as HTMLDivElement, {
            center: {
                lat: 0,
                lng: 0,
            },
            zoom: 1,
            disableDefaultUI: true,
            clickableIcons: false,
            streetViewControl: true,
        })

        const svPanorama = new google.maps.StreetViewPanorama(
            svPanoramaElRef.current as HTMLDivElement,
            {
                addressControl: false,
                fullscreenControl: false,
            },
        )

        map.setStreetView(svPanorama)

        const svService = new google.maps.StreetViewService()

        const svLayer = new google.maps.StreetViewCoverageLayer()
        svLayer.setMap(map)

        mapRef.current = map
        svPanoramaRef.current = svPanorama
        svServiceRef.current = svService

        loadPanorama(randomLatLng())
    }

    const loadPanorama = (location: google.maps.LatLngLiteral) => {
        if (!svPanoramaRef.current) return
        if (!svServiceRef.current) return

        svServiceRef.current
            .getPanorama({
                location,
                preference: google.maps.StreetViewPreference.BEST,
                sources: [google.maps.StreetViewSource.OUTDOOR],
                radius: 10000,
            })
            .then(({ data }) => {
                if (data.location) {
                    svPanoramaRef.current?.setPano(data.location.pano)
                    svPanoramaRef.current?.setPov({
                        heading: 0,
                        pitch: 0,
                    })

                    if (data.location.latLng)
                        mapRef.current?.setCenter(data.location.latLng)
                }
            })
            .catch(console.error)
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <main className={styles.main}>
            <div className={styles.btnContainer}>
                <button
                    onClick={() => {
                        setShowMap(!showMap)
                    }}
                >
                    Open Map
                </button>
                <button
                    onClick={() => {
                        loadPanorama(randomLatLng())
                    }}
                >
                    Get StreetView
                </button>
            </div>

            <div
                className={styles.mapContainer}
                style={{
                    display: showMap ? 'flex' : 'none',
                }}
            >
                <div ref={mapElRef} className={styles.map} />
            </div>

            <div ref={svPanoramaElRef} className={styles.pano} />
        </main>
    )
}

export default RandomStreetView
