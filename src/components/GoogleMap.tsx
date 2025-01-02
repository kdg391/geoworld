'use client'

import { memo, useEffect, useRef } from 'react'

import useGoogleApi from '../hooks/useGoogleApi.js'

interface Props {
  defaultOptions?: google.maps.MapOptions
  onLoaded: (map: google.maps.Map) => void
  children?: React.ReactNode
}

const GoogleMap = ({
  defaultOptions,
  onLoaded,
  ...props
}: Props &
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >) => {
  const mapElRef = useRef<HTMLDivElement | null>(null)

  const { isGoogleApiLoaded } = useGoogleApi()

  useEffect(() => {
    if (!isGoogleApiLoaded) return

    const map = new google.maps.Map(
      mapElRef.current as HTMLDivElement,
      defaultOptions,
    )

    onLoaded(map)
  }, [isGoogleApiLoaded])

  return <div ref={mapElRef} {...props}></div>
}

export default memo(GoogleMap)
