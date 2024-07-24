'use client'

import { Loader } from '@googlemaps/js-api-loader'
import { useCallback, useMemo, useState } from 'react'

import GoogleApiContext from '../contexts/GoogleApiContext.js'

interface Props {
  children?: React.ReactNode
}

const GoogleApiProvider = ({ children }: Props) => {
  const [isLoaded, setIsLoaded] = useState(false)

  const loader = useMemo(
    () =>
      new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
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
  }, [isLoaded, loader])

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