'use client'

import { Loader } from '@googlemaps/js-api-loader'
import { useCallback, useMemo, useState } from 'react'

import GoogleApiContext from '../contexts/GoogleApiContext.js'

interface Props {
  children?: React.ReactNode
}

const GoogleApiProvider = ({ children }: Props) => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)

  const loader = useMemo(
    () =>
      new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: 'weekly',
      }),
    [],
  )

  const loadGoogleApi = useCallback(async () => {
    if (isGoogleLoaded) return

    await loader.importLibrary('core')
    await loader.importLibrary('maps')
    await loader.importLibrary('marker')
    await loader.importLibrary('streetView')

    setIsGoogleLoaded(true)
  }, [isGoogleLoaded, loader])

  const providerValue = useMemo(
    () => ({ isGoogleLoaded, loadGoogleApi }),
    [isGoogleLoaded, loadGoogleApi],
  )

  return (
    <GoogleApiContext.Provider value={providerValue}>
      {children}
    </GoogleApiContext.Provider>
  )
}

export default GoogleApiProvider
