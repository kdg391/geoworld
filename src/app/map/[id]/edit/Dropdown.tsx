'use client'

import { Download, MapPinX, Trash, Upload } from 'lucide-react'
import { createPortal } from 'react-dom'

import { useTranslation } from '@/i18n/client.js'

import { classNames } from '@/utils/index.js'

import styles from './Dropdown.module.css'

import './Dropdown.css'

import type { Coords } from '@/types/index.js'

interface Props {
  locations: Coords[]
  setLocations: React.Dispatch<React.SetStateAction<Coords[]>>
  isDropdownOpen: boolean
  setIsClearConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Dropdown = ({
  locations,
  setLocations,
  isDropdownOpen,
  setIsClearConfirmOpen,
  setIsDeleteConfirmOpen,
}: Props) => {
  const { t } = useTranslation('map-builder')

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

  return createPortal(
    <ul className={classNames(styles.dropdown, isDropdownOpen ? 'active' : '')}>
      <li>
        <input
          type="file"
          name="file"
          id="file"
          accept=".json,.txt"
          hidden
          onChange={onFileChange}
        />
        <label htmlFor="file">
          <Upload size={18} />
          {t('import_json')}
        </label>
      </li>
      <li onClick={onExportClick}>
        <Download size={18} />
        {t('export_json')}
      </li>
      <li onClick={() => setIsClearConfirmOpen(true)}>
        <MapPinX size={18} />
        {t('clear_all_locations')}
      </li>
      <li onClick={() => setIsDeleteConfirmOpen(true)}>
        <Trash size={18} />
        {t('delete_map')}
      </li>
    </ul>,
    document.body,
  )
}

export default Dropdown
