'use client'

import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'

import { getLocations, getMap } from '@/actions/map.js'

import useGoogleApi from '@/hooks/useGoogleApi.js'

import styles from './page.module.css'

import type { Coords, Map } from '@/types/index.js'

const Button = dynamic(() => import('@/components/common/Button/index.js'))
const Dropdown = dynamic(() => import('./Dropdown.js'))
const EditMap = dynamic(() => import('@/components/EditMap/index.js'))
const SaveMapModal = dynamic(() => import('@/components/SaveMapModal/index.js'))

interface Props {
  params: {
    id: string
  }
}

const Edit = ({ params }: Props) => {
  const { isLoaded, loadGoogleApi } = useGoogleApi()

  const { data: session, status } = useSession()

  const [mapData, setMapData] = useState<Map | null>()
  const [locations, setLocations] = useState<Coords[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Coords | null>(null)
  const [haveLocationsChanged, setHaveLocationsChanged] = useState(false)

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)

  const position = useRef<google.maps.LatLngLiteral | null>(null)
  const heading = useRef<number>(0)
  const pitch = useRef<number>(0)
  const zoom = useRef<number>(0)
  const panoId = useRef<string | null>(null)

  const svPanoramaElRef = useRef<HTMLDivElement | null>(null)
  const svPanoramaRef = useRef<google.maps.StreetViewPanorama | null>(null)

  const svServiceRef = useRef<google.maps.StreetViewService | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    const init = async () => {
      if (!session) {
        setMapData(null)
        return
      }

      const { data: mapData, error: mErr } = await getMap(params.id)

      if (!mapData || mErr || mapData.creator !== session.user.id) {
        setMapData(null)
        return
      }

      setMapData(mapData)

      const { data: lData, error: lErr } = await getLocations(mapData.id)

      if (!lData || lErr) {
        setLocations([])
        return
      }

      if (!isLoaded) await loadGoogleApi()

      setLocations(lData)
    }

    init()
  }, [status])

  useEffect(() => {
    const onBeforeUnload = (event: Event) => {
      if (!haveLocationsChanged) return

      event.preventDefault()
      event.returnValue = true
    }

    window.addEventListener('beforeunload', onBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [haveLocationsChanged])

  useEffect(() => {
    if (!isLoaded) return

    initStreetView()
  }, [isLoaded])

  useEffect(() => {
    loadPanorama()
  }, [selectedLocation])

  const initStreetView = () => {
    if (!svPanoramaElRef.current) return

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
    })

    svPanorama.addListener('pov_changed', () => {
      const pov = svPanorama.getPov()

      heading.current = pov.heading
      pitch.current = pov.pitch
    })

    svPanorama.addListener('zoom_changed', () => {
      const _zoom = svPanorama.getZoom()

      zoom.current = _zoom
    })
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
      heading: 0,
      pitch: 0,
      zoom: 0,
    }

    setLocations((prev) => [...prev, newLoc])
    setSelectedLocation(newLoc)
  }

  const clearLocations = () => {
    setHaveLocationsChanged(true)
    setLocations([])
    setSelectedLocation(null)
  }

  const onUpdateClick = () => {
    if (!selectedLocation) return

    setHaveLocationsChanged(true)

    const updatedLocations = [...locations]
    const indexOfSelected = updatedLocations.indexOf(selectedLocation)

    if (position.current) {
      updatedLocations[indexOfSelected].lat = position.current.lat
      updatedLocations[indexOfSelected].lng = position.current.lng
    }

    updatedLocations[indexOfSelected].heading = heading.current
    updatedLocations[indexOfSelected].pitch = pitch.current
    updatedLocations[indexOfSelected].zoom = zoom.current

    if (panoId.current) {
      updatedLocations[indexOfSelected].pano_id = panoId.current
    }

    setLocations(updatedLocations)
    setSelectedLocation(null)
  }

  const handleRemoveLocation = () => {
    setHaveLocationsChanged(true)

    if (!selectedLocation) {
      setLocations((prev) => prev.slice(0, -1))
      return
    }

    setLocations((prev) => prev.filter((x) => x !== selectedLocation))
    setSelectedLocation(null)
  }

  if (mapData === undefined) return <div>Loading...</div>
  if (mapData === null) notFound()

  return (
    <>
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

      <div className={styles.footer}>
        <span>{locations.length} Locations</span>
        <div className={styles['footer-actions']}>
          <Button
            variant="primary"
            size="m"
            disabled={!haveLocationsChanged}
            onClick={() => setIsSaveModalOpen(true)}
          >
            Save Map
          </Button>
          <Button
            variant="primary"
            size="m"
            disabled={selectedLocation === null}
            onClick={onUpdateClick}
          >
            Update
          </Button>
          <Button
            variant="danger"
            size="m"
            disabled={selectedLocation === null}
            onClick={handleRemoveLocation}
          >
            Remove
          </Button>

          <Dropdown
            clearLocations={clearLocations}
            locations={locations}
            setLocations={setLocations}
          />
        </div>
      </div>

      <SaveMapModal
        defaultChecked={mapData.is_published}
        isModalOpen={isSaveModalOpen}
        setIsModalOpen={setIsSaveModalOpen}
        locations={locations}
        mapId={mapData.id}
      />
    </>
  )
}

export default Edit
