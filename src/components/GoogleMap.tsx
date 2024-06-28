import { memo, useEffect, useRef } from 'react'

import useGoogleApi from '../hooks/useGoogleApi.js'

interface Props {
    defaultOptions?: google.maps.MapOptions
    onLoaded: (map: google.maps.Map) => void
    children?: React.ReactNode
}

const GoogleMap: React.FC<
    Props &
        React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLDivElement>,
            HTMLDivElement
        >
> = memo(({ defaultOptions, onLoaded, ...props }) => {
    const mapElRef = useRef<HTMLDivElement | null>(null)

    const { isLoaded } = useGoogleApi()

    useEffect(() => {
        if (!isLoaded) return

        const map = new google.maps.Map(
            mapElRef.current as HTMLDivElement,
            defaultOptions,
        )

        onLoaded(map)
    }, [isLoaded])

    return <div ref={mapElRef} {...props}></div>
})

export default GoogleMap
