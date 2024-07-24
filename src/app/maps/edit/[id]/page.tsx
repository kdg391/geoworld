'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { getLocations, getMap, updateMap } from '../../../../actions/map.js'
import { getUser } from '../../../../actions/user.js'

import useGoogleApi from '../../../../hooks/useGoogleApi.js'

import styles from './page.module.css'

import type { Location, Map } from '../../../../types/index.js'

const EditMap = dynamic(() => import('./EditMap.js'))

const Edit = ({ params }: { params: { id: string } }) => {
  const { isLoaded, loadApi } = useGoogleApi()

  const router = useRouter()

  const [mapData, setMapData] = useState<Map | null>()
  const [locations, setLocations] = useState<
    Omit<Location, 'id' | 'map_id' | 'user_id'>[]
  >([])
  const [selectedLocation, setSelectedLocation] = useState<Omit<
    Location,
    'id' | 'map_id' | 'user_id'
  > | null>(null)
  const [haveLocationsChanged, setHaveLocationsChanged] = useState(false)
  const [showPreviewMap, setShowPreviewMap] = useState(false)

  const position = useRef<google.maps.LatLngLiteral | null>(null)
  const heading = useRef<number>(0)
  const pitch = useRef<number>(0)
  const zoom = useRef<number>(0)
  const panoId = useRef<string | null>(null)

  const svPanoramaElRef = useRef<HTMLDivElement | null>(null)
  const svPanoramaRef = useRef<google.maps.StreetViewPanorama | null>(null)

  const svServiceRef = useRef<google.maps.StreetViewService | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: uData, error: uErr } = await getUser()

      if (!uData.user || uErr) {
        //
        setMapData(null)
        return
      }

      const { data: mData, error: mErr } = await getMap(params.id)

      if (!mData || mErr || mData.creator !== uData.user.id) {
        setMapData(null)
        return
      }

      setMapData(mData)

      const { data: lData, error: lErr } = await getLocations(mData.id)

      if (!lData || lErr) {
        setLocations([])
        return
      }

      if (!isLoaded) await loadApi()

      setLocations(lData)
    }

    init()
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    if (!svPanoramaElRef.current) return

    initStreetView()
  }, [isLoaded])

  useEffect(() => {
    loadPanorama()
  }, [selectedLocation])

  const initStreetView = () => {
    const svPanorama = new google.maps.StreetViewPanorama(
      svPanoramaElRef.current as HTMLDivElement,
      {
        addressControl: false,
        clickToGo: true,
      },
    )
    svPanoramaRef.current = svPanorama

    const svService = new google.maps.StreetViewService()
    svServiceRef.current = svService

    svPanorama.addListener('position_changed', () => {
      const pos = svPanorama.getPosition()

      if (!pos) return

      position.current = pos.toJSON()
      loadPanorama()
    })

    // svPanorama.addListener('pov_changed', () => {
    //   const pov = svPanorama.getPov()

    //   heading.current = pov.heading
    //   pitch.current = pov.pitch
    // })

    // svPanorama.addListener('zoom_changed', () => {
    //   const _zoom = svPanorama.getZoom()

    //   zoom.current = _zoom
    // })
  }

  const loadPanorama = () => {
    if (!svPanoramaRef.current) return
    if (!svServiceRef.current) return
    if (!selectedLocation) return

    svServiceRef.current
      .getPanorama({
        location: selectedLocation,
      })
      .then(({ data }) => {
        if (!data.location || !data.location.latLng) return

        svPanoramaRef.current?.setPano(data.location.pano)
        svPanoramaRef.current?.setPov({
          heading: selectedLocation.heading,
          pitch: selectedLocation.pitch,
        })
        svPanoramaRef.current?.setZoom(selectedLocation.zoom)
      })
      .catch(console.error)
  }

  const addNewLocation = (loc: google.maps.LatLngLiteral, panoId: string) => {
    setHaveLocationsChanged(true)

    const newLoc = {
      ...loc,
      pano_id: panoId,
      heading: heading.current,
      pitch: pitch.current,
      zoom: zoom.current,
    }

    setLocations((prev) => [...prev, newLoc])
    setSelectedLocation(newLoc)
  }

  const clearLocations = () => {
    setHaveLocationsChanged(true)
    setLocations([])
    setSelectedLocation(null)
    setShowPreviewMap(false)
  }

  const handleUpdateLocation = () => {
    if (!selectedLocation) return

    setHaveLocationsChanged(true)
    setShowPreviewMap(false)

    const updatedLocations = [...locations]
    const indexOfSelected = updatedLocations.indexOf(selectedLocation)

    if (position.current) {
      updatedLocations[indexOfSelected].lat = position.current.lat
      updatedLocations[indexOfSelected].lng = position.current.lng
    }

    if (heading.current) {
      updatedLocations[indexOfSelected].heading = heading.current
    }

    if (pitch.current) {
      updatedLocations[indexOfSelected].pitch = pitch.current
    }

    if (zoom.current) {
      updatedLocations[indexOfSelected].zoom = zoom.current
    }

    if (panoId.current) {
      updatedLocations[indexOfSelected].pano_id = panoId.current
    }

    setLocations(updatedLocations)
    setSelectedLocation(null)
  }

  const handleRemoveLocation = () => {
    setHaveLocationsChanged(true)
    setShowPreviewMap(false)

    if (!selectedLocation) {
      return setLocations((prev) => prev.slice(0, -1))
    }

    setLocations((prev) => prev.filter((x) => x !== selectedLocation))
    setSelectedLocation(null)
  }

  const update = async () => {
    if (!mapData) return

    const { data: mData, error: mErr } = await updateMap(mapData.id, {
      locations,
    })

    if (!mData || mErr) return

    router.push('/')
  }

  if (mapData === undefined) return <div>Loading...</div>
  if (mapData === null) return <div>Map Not Found</div>

  return (
    <>
      <div className={styles.header}>
        <button disabled={!haveLocationsChanged} onClick={() => update()}>
          Update Map
        </button>
      </div>

      <main className={styles.main}>
        <div className={styles.container}>
          <EditMap
            addNewLocation={addNewLocation}
            locations={locations}
            setSelectedLocation={setSelectedLocation}
          />
          <div ref={svPanoramaElRef} className={styles['street-view']}></div>
        </div>
      </main>

      <div
        style={{
          height: '50px',
        }}
      >
        <span>{locations.length} Locations</span>
        <button
          disabled={showPreviewMap}
          onClick={() => handleUpdateLocation()}
        >
          Upate
        </button>
        <button
          disabled={showPreviewMap}
          onClick={() => handleRemoveLocation()}
        >
          Remove
        </button>
        <button
          disabled={showPreviewMap}
          onClick={() => {
            if (confirm('Are you sure you want to clear all locations?'))
              clearLocations()
          }}
        >
          Clear All Locations
        </button>
      </div>
    </>
  )
}

export default Edit
