'use client'

import { importLibrary, setOptions } from '@googlemaps/js-api-loader'
import { useCallback, useEffect, useMemo, useState } from 'react'

import GoogleApiContext from '../contexts/GoogleApiContext.ts'

interface Props {
  children?: React.ReactNode
}

const GoogleApiProvider = ({ children }: Props) => {
  const [isGoogleApiLoaded, setIsGoogleApiLoaded] = useState(false)

  useEffect(() => {
    setOptions({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
      v: 'weekly',
      language: 'ko',
    })
  }, [])

  const loadGoogleApi = useCallback(async () => {
    if (isGoogleApiLoaded) return

    await importLibrary('core')
    await importLibrary('maps')
    await importLibrary('marker')
    await importLibrary('streetView')

    setIsGoogleApiLoaded(true)
  }, [isGoogleApiLoaded])

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
