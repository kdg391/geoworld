'use client'

import dynamic from 'next/dynamic'

import useSettings from '@/hooks/useSettings.js'

import { useTranslation } from '@/i18n/client.js'

import type { DistanceUnit } from '@/types/index.js'

const Select = dynamic(() => import('../common/Select/index.js'))

const DistanceUnitSelect = () => {
  const { distanceUnit, setDistanceUnit } = useSettings()

  const { t } = useTranslation('common')

  const distanceUnitOptions = [
    {
      value: 'imperial',
      label: t('distance_unit.imperial'),
    },
    {
      value: 'metric',
      label: t('distance_unit.metric'),
    },
  ]

  return (
    <Select
      items={distanceUnitOptions}
      label={t('distance_unit')}
      menuPlacement="bottom"
      onSelectedItemChange={({ selectedItem }) => {
        setDistanceUnit(selectedItem.value as DistanceUnit)
      }}
      selectedItem={distanceUnitOptions.find(
        (opt) => opt.value === distanceUnit,
      )}
    />
  )
}

export default DistanceUnitSelect
