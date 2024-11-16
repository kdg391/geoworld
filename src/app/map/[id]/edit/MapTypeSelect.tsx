'use client'

import { useMemo } from 'react'

import { useTranslation } from '@/i18n/client.js'

import Select from '@/components/common/Select/index.js'

interface Props {
  map: google.maps.Map | null
}

const MapTypeSelect = ({ map }: Props) => {
  const { t } = useTranslation('map-builder')

  const items = useMemo(
    () => [
      {
        value: 'roadmap',
        label: t('type.roadmap'),
      },
      {
        value: 'hybrid',
        label: t('type.hybrid'),
      },
      {
        value: 'satellite',
        label: t('type.satellite'),
      },
      {
        value: 'terrain',
        label: t('type.terrain'),
      },
    ],
    [t],
  )

  if (!map) return

  return (
    <Select
      defaultSelectedItem={items.find((i) => i.value === map.getMapTypeId())}
      items={items}
      onSelectedItemChange={({ selectedItem }) => {
        map.setMapTypeId(selectedItem.value)
      }}
    />
  )
}

export default MapTypeSelect
