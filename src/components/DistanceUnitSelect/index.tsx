'use client'

import dynamic from 'next/dynamic'

import useSettings from '../../hooks/useSettings.js'

import { useTranslation } from '../../i18n/client.js'

import type { DistanceUnit } from '../../types/index.js'

const Select = dynamic(() => import('../common/Select/index.js'))

const DistanceUnitSelect = () => {
  const { distanceUnit, setDistanceUnit } = useSettings()

  const { t } = useTranslation('settings')

  const distanceUnitOptions = [
    {
      value: 'imperial',
      label: t('translation:distanceUnit.imperial'),
    },
    {
      value: 'metric',
      label: t('translation:distanceUnit.metric'),
    },
  ]

  return (
    <Select
      defaultSelectedItem={
        distanceUnitOptions.find((opt) => opt.value === distanceUnit)!
      }
      label={t('distanceUnit')}
      items={distanceUnitOptions}
      menuPlacement="bottom"
      onSelectedItemChange={({ selectedItem }) => {
        setDistanceUnit(selectedItem.value as DistanceUnit)
      }}
    />
  )
}

export default DistanceUnitSelect
