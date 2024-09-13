'use client'

import { ArrowUpLeft, ArrowDownRight, Pin, PinOff } from 'lucide-react'

import { useTranslation } from '@/i18n/client.js'

import styles from './index.module.css'

const MIN_MAP_SIZE = 0
const MAX_MAP_SIZE = 3

interface Props {
  isMapPinned: boolean
  setIsMapPinned: React.Dispatch<React.SetStateAction<boolean>>
  mapSize: number
  setMapSize: React.Dispatch<React.SetStateAction<number>>
}

const GuessMapControls = ({
  isMapPinned,
  setIsMapPinned,
  mapSize,
  setMapSize,
}: Props) => {
  const { t } = useTranslation('game')

  return (
    <div className={styles['guess-map-controls']}>
      <button
        disabled={mapSize >= MAX_MAP_SIZE}
        aria-label={t('guess_map.increase_map_size')}
        onClick={() => setMapSize((s) => (s >= MAX_MAP_SIZE ? s : s + 1))}
      >
        <ArrowUpLeft size={16} />
      </button>
      <button
        disabled={mapSize <= MIN_MAP_SIZE}
        aria-label={t('guess_map.decrease_map_size')}
        onClick={() => setMapSize((s) => (s <= MIN_MAP_SIZE ? s : s - 1))}
      >
        <ArrowDownRight size={16} />
      </button>
      <button onClick={() => setIsMapPinned((p) => !p)}>
        {isMapPinned ? <Pin size={16} /> : <PinOff size={16} />}
      </button>
    </div>
  )
}

export default GuessMapControls
