'use client'

import { useEffect, useMemo, useState } from 'react'

import SettingsContext from '../contexts/SettingsContext.js'

import type { DistanceUnit } from '../types/index.js'

interface Props {
  children: React.ReactNode
}

const getDistanceUnit = () => {
  if (typeof window === 'undefined') return 'metric'

  let distanceUnit

  try {
    distanceUnit = localStorage.getItem('distanceUnit')
  } catch {}

  return (distanceUnit ?? 'metric') as DistanceUnit
}

const SettingsProvider = ({ children }: Props) => {
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>(() =>
    getDistanceUnit(),
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
