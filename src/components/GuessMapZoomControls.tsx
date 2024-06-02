import React, { useEffect, useState } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa6'

import styles from './GuessMapZoomControls.module.css'

const MAX_ZOOM = 22
const MIN_ZOOM = 0

interface Props {
    map: google.maps.Map | null
}

const MapControls: React.FC<Props> = ({ map }) => {
    const [zoom, setZoom] = useState(MIN_ZOOM)

    useEffect(() => {
        if (!map) return

        const zoomChangeEvent = map.addListener('zoom_changed', () => {
            const zoom = map.getZoom()

            if (zoom === undefined) return

            setZoom(zoom)
        })

        return () => {
            zoomChangeEvent.remove()
        }
    }, [map])

    return (
        <div className={styles.guessMapZoomControls}>
            <button
                disabled={zoom >= MAX_ZOOM}
                onClick={() => {
                    if (!map) return

                    const zoom = map.getZoom()

                    if (zoom === undefined) return

                    map.setZoom(zoom + 1)
                }}
            >
                <FaPlus size={20} />
            </button>
            <button
                disabled={zoom <= MIN_ZOOM}
                onClick={() => {
                    if (!map) return

                    const zoom = map.getZoom()

                    if (zoom === undefined) return

                    map.setZoom(zoom - 1)
                }}
            >
                <FaMinus size={20} />
            </button>
        </div>
    )
}

export default MapControls
