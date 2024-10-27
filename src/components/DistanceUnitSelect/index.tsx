'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import { useTranslation } from '@/i18n/client.js'

import type { DistanceUnit } from '@/types/index.js'

const Select = dynamic(() => import('../common/Select/index.js'))

const DistanceUnitSelect = () => {
  const [distanceUnit, setDistanceUnit] = useLocalStorage(
    'distanceUnit',
    'metric',
  )

  const { t } = useTranslation('common')

  const distanceUnitOptions = useMemo(
    () => [
      {
        value: 'imperial',
        label: t('distance_unit.imperial'),
      },
      {
        value: 'metric',
        label: t('distance_unit.metric'),
      },
    ],
    [t],
  )

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
