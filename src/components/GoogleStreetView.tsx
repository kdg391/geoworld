'use client'

import { memo, useEffect, useRef } from 'react'

import useGoogleApi from '../hooks/useGoogleApi.js'

interface Props {
  defaultOptions?: google.maps.StreetViewPanoramaOptions
  onLoaded: (pano: google.maps.StreetViewPanorama) => void
  children?: React.ReactNode
}

const GoogleStreetView = ({
  defaultOptions,
  onLoaded,
  ...props
}: Props &
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >) => {
  const svPanoElRef = useRef<HTMLDivElement | null>(null)

  const { isGoogleLoaded } = useGoogleApi()

  useEffect(() => {
    if (!isGoogleLoaded) return

    const svPano = new google.maps.StreetViewPanorama(
      svPanoElRef.current as HTMLDivElement,
      defaultOptions,
    )

    onLoaded(svPano)
  }, [isGoogleLoaded])

  return <div ref={svPanoElRef} {...props}></div>
}

export default memo(GoogleStreetView)
