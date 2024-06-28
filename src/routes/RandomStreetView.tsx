import { Suspense, lazy, useEffect, useRef, useState } from 'react'

import useGoogleApi from '../hooks/useGoogleApi.js'

import styles from './RandomStreetView.module.css'

const GoogleMap = lazy(() => import('../components/GoogleMap.js'))

const randomLatLng = (): google.maps.LatLngLiteral => {
    const lat = Math.random() * 180 - 90
    const lng = Math.random() * 360 - 180

    return {
        lat,
        lng,
    }
}

const RandomStreetView = () => {
    const [showMap, setShowMap] = useState(false)

    const svPanoramaElRef = useRef<HTMLDivElement | null>(null)

    const mapRef = useRef<google.maps.Map | null>(null)
    const svPanoramaRef = useRef<google.maps.StreetViewPanorama | null>(null)
    const svServiceRef = useRef<google.maps.StreetViewService | null>(null)

    const { isLoaded, loadApi } = useGoogleApi()

    const init = (map: google.maps.Map) => {
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
                radius: 10_000,
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
        if (!isLoaded) loadApi()
    }, [isLoaded])

    return (
        <main className={styles.main}>
            <div className={styles['btn-container']}>
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
                className={styles['map-container']}
                style={{
                    display: showMap ? 'flex' : 'none',
                }}
            >
                <Suspense>
                    <GoogleMap
                        defaultOptions={{
                            center: {
                                lat: 0,
                                lng: 0,
                            },
                            zoom: 1,
                            disableDefaultUI: true,
                            clickableIcons: false,
                            streetViewControl: true,
                        }}
                        onLoaded={(map) => init(map)}
                    />
                </Suspense>
            </div>

            <div ref={svPanoramaElRef} className={styles.pano} />
        </main>
    )
}

export default RandomStreetView
