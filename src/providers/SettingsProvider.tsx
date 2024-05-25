import React, { useState } from 'react'

import SettingsContext from '../contexts/SettingsContext.js'

import type { DistanceUnit } from '../types/index.js'

interface Props {
    children: React.ReactNode
}

const SettingsProvider: React.FC<Props> = ({ children }) => {
    const [unit, setUnit] = useState<DistanceUnit>('metric')

    const providerValue = React.useMemo(
        () => ({
            unit,
            setUnit,
        }),
        [unit],
    )

    return (
        <SettingsContext.Provider value={providerValue}>
            {children}
        </SettingsContext.Provider>
    )
}

export default SettingsProvider
