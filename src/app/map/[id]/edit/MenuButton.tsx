'use client'

import { Ellipsis } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'

import { useTranslation } from '@/i18n/client.js'

import useClickOutside from '@/hooks/useClickOutside.js'

import styles from './MenuButton.module.css'

import './MenuButton.css'

import type { Coords } from '@/types/index.js'

const ClearLocationsConfirm = dynamic(
  () => import('./ClearLocationsConfirm.js'),
)
const DeleteMapConfirm = dynamic(
  () => import('@/components/DeleteMapConfirm/index.js'),
)
const Dropdown = dynamic(() => import('./Dropdown.js'))

interface Props {
  clearLocations: () => void
  locations: Coords[]
  setLocations: React.Dispatch<React.SetStateAction<Coords[]>>
  mapId: string
}

const MenuButton = ({
  clearLocations,
  locations,
  setLocations,
  mapId,
}: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  const [isDropdownOpen, setIsDropdownOpen] = useClickOutside(containerRef)

  const { t } = useTranslation('map-builder')

  return (
    <>
      <div ref={containerRef}>
        <button
          aria-label={t('menu')}
          className={styles['menu-btn']}
          onClick={() => setIsDropdownOpen((o) => !o)}
        >
          <Ellipsis size={18} />
        </button>
      </div>

      <Dropdown
        isDropdownOpen={isDropdownOpen}
        locations={locations}
        setLocations={setLocations}
        setIsClearConfirmOpen={setIsClearConfirmOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
      />

      <ClearLocationsConfirm
        clearLocations={clearLocations}
        isOpen={isClearConfirmOpen}
        setIsOpen={setIsClearConfirmOpen}
      />

      <DeleteMapConfirm
        isOpen={isDeleteConfirmOpen}
        setIsOpen={setIsDeleteConfirmOpen}
        mapId={mapId}
      />
    </>
  )
}

export default MenuButton
