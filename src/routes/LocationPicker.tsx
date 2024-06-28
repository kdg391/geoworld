import { Suspense, lazy, useEffect, useRef, useState } from 'react'

import useGoogleApi from '../hooks/useGoogleApi.js'

import styles from './LocationPicker.module.css'

const GoogleMap = lazy(() => import('../components/GoogleMap.js'))

const LocationPicker = () => {
    const [position, setPosition] = useState<google.maps.LatLngLiteral | null>(
        null,
    )

    const svPanoramaElRef = useRef<HTMLDivElement | null>(null)

    const svPanoramaRef = useRef<google.maps.StreetViewPanorama | null>(null)
    const svServiceRef = useRef<google.maps.StreetViewService | null>(null)

    const { isLoaded, loadApi } = useGoogleApi()

    const init = (map: google.maps.Map) => {
        const svPanorama = new google.maps.StreetViewPanorama(
            svPanoramaElRef.current as HTMLDivElement,
        )

        map.setStreetView(svPanorama)

        const svService = new google.maps.StreetViewService()

        const svLayer = new google.maps.StreetViewCoverageLayer()
        svLayer.setMap(map)

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
        if (!isLoaded) loadApi()
    }, [isLoaded])

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
                <Suspense>
                    <GoogleMap
                        defaultOptions={{
                            center: {
                                lat: 0,
                                lng: 0,
                            },
                            zoom: 1,
                            zoomControl: true,
                            streetViewControl: true,
                            scrollwheel: true,
                            clickableIcons: false,
                            draggableCursor: 'crosshair',
                        }}
                        onLoaded={(map) => init(map)}
                        className={styles.map}
                    />
                </Suspense>
                <div ref={svPanoramaElRef} className={styles.pano}></div>
            </div>
        </main>
    )
}

export default LocationPicker
