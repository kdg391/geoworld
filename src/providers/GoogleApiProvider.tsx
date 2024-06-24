import { Loader } from '@googlemaps/js-api-loader'
import { useCallback, useMemo, useState } from 'react'

import GoogleApiContext from '../contexts/GoogleApiContext.js'

interface Props {
    children?: React.ReactNode
}

const GoogleApiProvider: React.FC<Props> = ({ children }) => {
    const [isLoaded, setIsLoaded] = useState(false)

    const loader = useMemo(
        () =>
            new Loader({
                apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
                version: 'weekly',
            }),
        [],
    )

    const loadApi = useCallback(async () => {
        if (isLoaded) return

        await loader.importLibrary('core')
        await loader.importLibrary('maps')
        await loader.importLibrary('marker')
        await loader.importLibrary('streetView')

        setIsLoaded(true)
    }, [])

    const providerValue = useMemo(
        () => ({ isLoaded, loadApi }),
        [isLoaded, loadApi],
    )

    return (
        <GoogleApiContext.Provider value={providerValue}>
            {children}
        </GoogleApiContext.Provider>
    )
}

export default GoogleApiProvider
