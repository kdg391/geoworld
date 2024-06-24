import { useEffect, useMemo, useState } from 'react'

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
        } catch {
            // empty
        }
    }, [distanceUnit])

    const providerValue = useMemo(
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
