'use client'

import dynamic from 'next/dynamic'

import useSettings from '../../hooks/useSettings.js'

import type { DistanceUnit } from '../../types/index.js'

const Select = dynamic(() => import('../common/Select/index.js'))

const distanceUnitOptions = [
  {
    value: 'imperial',
    label: 'Imperial',
  },
  {
    value: 'metric',
    label: 'Metric',
  },
]

const DistanceUnitSelect = () => {
  const { distanceUnit, setDistanceUnit } = useSettings()

  return (
    <Select
      defaultSelectedItem={
        distanceUnitOptions.find((opt) => opt.value === distanceUnit)!
      }
      label="Distance Unit"
      items={distanceUnitOptions}
      menuPlacement="top"
      onSelectedItemChange={({ selectedItem }) => {
        setDistanceUnit(selectedItem.value as DistanceUnit)
      }}
    />
  )
}

export default DistanceUnitSelect
