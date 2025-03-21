'use client'

import { Loader } from '@googlemaps/js-api-loader'
import { useCallback, useMemo, useState } from 'react'

import GoogleApiContext from '../contexts/GoogleApiContext.js'

interface Props {
  children?: React.ReactNode
}

const GoogleApiProvider = ({ children }: Props) => {
  const [isGoogleApiLoaded, setIsGoogleLoaded] = useState(false)

  const loader = useMemo(
    () =>
      new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: 'weekly',
      }),
    [],
  )

  const loadGoogleApi = useCallback(async () => {
    if (isGoogleApiLoaded) return

    await loader.importLibrary('core')
    await loader.importLibrary('maps')
    await loader.importLibrary('marker')
    await loader.importLibrary('streetView')

    setIsGoogleLoaded(true)
  }, [isGoogleApiLoaded, loader])

  const providerValue = useMemo(
    () => ({ isGoogleApiLoaded, loadGoogleApi }),
    [isGoogleApiLoaded, loadGoogleApi],
  )

  return (
    <GoogleApiContext.Provider value={providerValue}>
      {children}
    </GoogleApiContext.Provider>
  )
}

export default GoogleApiProvider
