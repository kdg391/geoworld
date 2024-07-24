'use client'

import { ArrowUpLeft, ArrowDownRight, Lock, LockOpen } from 'lucide-react'

import styles from './index.module.css'

const MIN_MAP_SIZE = 0
const MAX_MAP_SIZE = 3

interface Props {
  mapPinned: boolean
  mapSize: number
  setMapPinned: React.Dispatch<React.SetStateAction<boolean>>
  setMapSize: React.Dispatch<React.SetStateAction<number>>
}

const GuessMapControls = ({
  mapPinned,
  mapSize,
  setMapPinned,
  setMapSize,
}: Props) => (
  <div className={styles['guess-map-controls']}>
    <button
      disabled={mapSize >= MAX_MAP_SIZE}
      onClick={() => setMapSize((s) => (s >= MAX_MAP_SIZE ? s : s + 1))}
    >
      <ArrowUpLeft size={16} />
    </button>
    <button
      disabled={mapSize <= MIN_MAP_SIZE}
      onClick={() => setMapSize((s) => (s <= MIN_MAP_SIZE ? s : s - 1))}
    >
      <ArrowDownRight size={16} />
    </button>
    <button onClick={() => setMapPinned((p) => !p)}>
      {mapPinned ? <Lock size={16} /> : <LockOpen size={16} />}
    </button>
  </div>
)

export default GuessMapControls
