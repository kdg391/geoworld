'use client'

import { SquarePen } from 'lucide-react'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { getLocations, getMap } from '@/actions/map.js'

import useGoogleApi from '@/hooks/useGoogleApi.js'

import { useTranslation } from '@/i18n/client.js'

import styles from './page.module.css'

import type { Coords } from '@/types/location.js'
import type { Map } from '@/types/map.js'
import type { User } from '@/types/user.js'

const BuilderMap = dynamic(() => import('@/components/BuilderMap/index.js'))
const Button = dynamic(() => import('@/components/common/Button/index.js'))
const MapSettingsModal = dynamic(
  () => import('@/components/MapSettingsModal/index.js'),
)
const MenuButton = dynamic(() => import('./MenuButton.js'))
const SaveMapModal = dynamic(() => import('@/components/SaveMapModal/index.js'))

interface Props {
  params: {
    id: string
  }
  user: User
}

const ClientPage = ({ params, user }: Props) => {
  const { isGoogleApiLoaded, loadGoogleApi } = useGoogleApi()

  const [mapData, setMapData] = useState<Map | null>()
  const [locations, setLocations] = useState<Coords[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Coords | null>(null)
  const [haveLocationsChanged, setHaveLocationsChanged] = useState(false)

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  const position = useRef<google.maps.LatLngLiteral | null>(null)
  const heading = useRef<number>(0)
  const pitch = useRef<number>(0)
  const zoom = useRef<number>(0)
  const panoId = useRef<string | null>(null)

  const mapRef = useRef<google.maps.Map | null>(null)

  const svPanoramaElRef = useRef<HTMLDivElement | null>(null)
  const svPanoramaRef = useRef<google.maps.StreetViewPanorama | null>(null)

  const svServiceRef = useRef<google.maps.StreetViewService | null>(null)

  const { t } = useTranslation('map-builder')

  useEffect(() => {
    const init = async () => {
      const { data: mapData, errors: mErr } = await getMap(params.id)

      if (!mapData || mErr || mapData.creator !== user.id) {
        setMapData(null)
        return
      }

      setMapData(mapData)

      const { data: lData, errors: lErr } = await getLocations(mapData.id)

      if (!lData || lErr) {
        setLocations([])
        return
      }

      if (!isGoogleApiLoaded) await loadGoogleApi()

      setLocations(lData)
    }

    init()
  }, [])

  useEffect(() => {
    if (!haveLocationsChanged) return

    const onBeforeUnload = (event: Event) => {
      event.preventDefault()
      event.returnValue = true
    }

    window.addEventListener('beforeunload', onBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [haveLocationsChanged])

  useEffect(() => {
    if (!isGoogleApiLoaded) return

    initStreetView()
  }, [isGoogleApiLoaded])

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

  const loadPanorama = async () => {
    if (!svPanoramaRef.current) return
    if (!svServiceRef.current) return
    if (!selectedLocation) return

    await svServiceRef.current
      .getPanorama({
        location: selectedLocation,
      })
      .then(({ data }) => {
        if (!data.location || !data.location.latLng) return

        const heading = data.links?.[0].heading ?? 0

        svPanoramaRef.current?.setPano(data.location.pano)
        svPanoramaRef.current?.setPov({
          heading,
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
      panoId,
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
      updatedLocations[indexOfSelected].panoId = panoId.current
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
      <div className={styles.header}>
        <div className="flex">
          <div></div>
          <div>{mapData.name}</div>
          <button onClick={() => setIsSettingsModalOpen(true)}>
            <SquarePen size={16} />
          </button>
        </div>
        <div className="flex">
          {/* <MapTypeSelect map={mapRef.current} /> */}
          <Button
            variant="primary"
            size="m"
            disabled={!haveLocationsChanged}
            onClick={() => setIsSaveModalOpen(true)}
          >
            {t('save_map')}
          </Button>
          <MenuButton
            clearLocations={clearLocations}
            locations={locations}
            setLocations={setLocations}
            mapId={params.id}
          />
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.container}>
          <BuilderMap
            addNewLocation={addNewLocation}
            locations={locations}
            setSelectedLocation={setSelectedLocation}
            onLoaded={(map) => {
              mapRef.current = map
            }}
          />
          <div ref={svPanoramaElRef} className={styles['street-view']}></div>
        </div>
      </main>

      <div className={styles.footer}>
        <span>
          {t('locations', {
            count: locations.length,
          })}
        </span>
        <div className={styles['footer-actions']}>
          <Button
            variant="primary"
            size="m"
            disabled={selectedLocation === null}
            onClick={onUpdateClick}
          >
            {t('update_location')}
          </Button>
          <Button
            variant="danger"
            size="m"
            disabled={selectedLocation === null}
            onClick={handleRemoveLocation}
          >
            {t('remove_location')}
          </Button>
        </div>
      </div>

      <MapSettingsModal
        isEditing
        isModalOpen={isSettingsModalOpen}
        setIsModalOpen={setIsSettingsModalOpen}
        mapData={mapData}
      />

      <SaveMapModal
        defaultChecked={mapData.isPublished}
        isModalOpen={isSaveModalOpen}
        setIsModalOpen={setIsSaveModalOpen}
        locations={locations}
        mapId={mapData.id}
      />
    </>
  )
}

export default ClientPage
