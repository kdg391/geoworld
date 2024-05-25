import { createContext } from 'react'

import type { DistanceUnit } from '../types//index.js'

interface ContextValue {
    distanceUnit: DistanceUnit
    setDistanceUnit: React.Dispatch<React.SetStateAction<DistanceUnit>>
}

const SettingsContext = createContext<ContextValue | null>(null)

export default SettingsContext
