import React from 'react'
import { FaArrowDown, FaArrowUp, FaLock, FaLockOpen } from 'react-icons/fa6'

import styles from './GuessMapControls.module.css'

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
            <FaArrowUp className="increase" size={16} />
        </button>
        <button
            disabled={mapSize <= MIN_MAP_SIZE}
            onClick={() => {
                setMapSize((s) => (s < MIN_MAP_SIZE ? s : s - 1))
            }}
        >
            <FaArrowDown className="decrease" size={16} />
        </button>
        <button
            onClick={() => {
                setIsMapPinned((p) => !p)
            }}
        >
            {isMapPinned ? <FaLock size={16} /> : <FaLockOpen size={16} />}
        </button>
    </div>
)

export default GuessMapControls
