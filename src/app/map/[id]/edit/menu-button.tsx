'use client'

import { Ellipsis } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'

import { useTranslation } from '@/i18n/client.ts'
import useClickOutside from '@/hooks/useClickOutside.ts'

import type { Coords } from '@/types/location.ts'

const ClearLocationsConfirm = dynamic(
  () => import('./ClearLocationsConfirm.tsx'),
)
const DeleteMapConfirm = dynamic(
  () => import('@/components/DeleteMapDialog/index.tsx'),
)
const Dropdown = dynamic(() => import('./Dropdown.tsx'))

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
          className="w-9 h-9 flex items-center justify-center bg-gray-700"
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
