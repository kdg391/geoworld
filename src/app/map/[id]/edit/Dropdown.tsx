'use client'

import { Download, Ellipsis, MapPinX, Upload } from 'lucide-react'
import { useRef } from 'react'
import { createPortal } from 'react-dom'

import useClickOutside from '@/hooks/useClickOutside.js'

import { classNames } from '@/utils/index.js'

import styles from './Dropdown.module.css'

import './Dropdown.css'

import type { Coords } from '@/types/index.js'

interface Props {
  clearLocations: () => void
  locations: Coords[]
  setLocations: React.Dispatch<React.SetStateAction<Coords[]>>
}

const Dropdown = ({ clearLocations, locations, setLocations }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [isDropdownOpen, setIsDropdownOpen] = useClickOutside(containerRef)

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return

    const reader = new FileReader()

    reader.addEventListener('load', (e) => {
      let data

      try {
        data = JSON.parse(e.target?.result as string)
      } catch {
        return
      }

      if (!Array.isArray(data)) return

      setLocations(
        data.map((loc) => ({
          lat: loc.lat,
          lng: loc.lng,
          heading: loc.heading,
          pitch: loc.pitch,
          zoom: loc.zoom,
          pano_id: loc.pano_id ?? loc.panoId,
        })),
      )
    })

    reader.readAsText(event.target.files[0])
  }

  const onExportClick = () => {
    const data = JSON.stringify(
      locations.map((loc) => ({
        lat: loc.lat,
        lng: loc.lng,
        heading: loc.heading,
        pitch: loc.pitch,
        zoom: loc.zoom,
        pano_id: loc.pano_id,
      })),
    )

    const blob = new Blob([data], {
      type: 'application/json',
    })

    const url = URL.createObjectURL(blob)

    const anchor = document.createElement('a')

    anchor.download = 'locations.json'
    anchor.href = url

    anchor.click()
    anchor.remove()

    URL.revokeObjectURL(url)
  }

  return (
    <div ref={containerRef}>
      <button
        onClick={() => {
          setIsDropdownOpen((o) => !o)
        }}
      >
        <Ellipsis size={18} />
      </button>

      {createPortal(
        <ul
          className={classNames(
            styles.dropdown,
            isDropdownOpen ? 'active' : '',
          )}
        >
          <li>
            <input
              type="file"
              name="file"
              id="file"
              hidden
              onChange={onFileChange}
            />
            <label htmlFor="file">
              <Upload size={18} />
              Import JSON
            </label>
          </li>
          <li onClick={onExportClick}>
            <Download size={18} />
            Export JSON
          </li>
          <li
            onClick={() => {
              if (confirm('Are you sure you want to clear all locations?'))
                clearLocations()
            }}
          >
            <MapPinX size={18} />
            Clear All Locations
          </li>
        </ul>,
        document.body,
      )}
    </div>
  )
}

export default Dropdown
