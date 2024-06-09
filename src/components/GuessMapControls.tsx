import { ArrowDown, ArrowUp, Lock, LockOpen } from 'lucide-react'

import styles from './GuessMapControls.module.css'

import type React from 'react'

const MIN_MAP_SIZE = 0
const MAX_MAP_SIZE = 3

interface Props {
    isMapPinned: boolean
    mapSize: number
    setIsMapPinned: React.Dispatch<React.SetStateAction<boolean>>
    setMapSize: React.Dispatch<React.SetStateAction<number>>
}

const GuessMapControls: React.FC<Props> = ({
    isMapPinned,
    mapSize,
    setIsMapPinned,
    setMapSize,
}) => (
    <div className={styles.guessMapControls}>
        <button
            disabled={mapSize >= MAX_MAP_SIZE}
            onClick={() => {
                setMapSize((s) => (s >= MAX_MAP_SIZE ? s : s + 1))
            }}
        >
            <ArrowUp className="increase" size={16} />
        </button>
        <button
            disabled={mapSize <= MIN_MAP_SIZE}
            onClick={() => {
                setMapSize((s) => (s < MIN_MAP_SIZE ? s : s - 1))
            }}
        >
            <ArrowDown className="decrease" size={16} />
        </button>
        <button
            onClick={() => {
                setIsMapPinned((p) => !p)
            }}
        >
            {isMapPinned ? <Lock size={16} /> : <LockOpen size={16} />}
        </button>
    </div>
)

export default GuessMapControls
