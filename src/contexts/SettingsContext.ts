'use client'

import { createContext } from 'react'

import type { DistanceUnit } from '../types/index.js'

export interface ContextValue {
  distanceUnit: DistanceUnit | null
  setDistanceUnit: React.Dispatch<React.SetStateAction<DistanceUnit>>
}

const SettingsContext = createContext<ContextValue | null>(null)

export default SettingsContext
