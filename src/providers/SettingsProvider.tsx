import React, { useEffect, useState } from 'react'

import SettingsContext from '../contexts/SettingsContext.js'

import type { DistanceUnit } from '../types/index.js'

interface Props {
    children: React.ReactNode
}

const SettingsProvider: React.FC<Props> = ({ children }) => {
    const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>(
        () =>
            (localStorage.getItem('distanceUnit') as DistanceUnit | null) ??
            'metric',
    )

    useEffect(() => {
        const unit = localStorage.getItem('distanceUnit')

        if (distanceUnit === unit) return

        try {
            localStorage.setItem('distanceUnit', distanceUnit)
        } catch {}
    }, [distanceUnit])

    const providerValue = React.useMemo(
        () => ({
            distanceUnit,
            setDistanceUnit,
        }),
        [distanceUnit],
    )

    return (
        <SettingsContext.Provider value={providerValue}>
            {children}
        </SettingsContext.Provider>
    )
}

export default SettingsProvider
