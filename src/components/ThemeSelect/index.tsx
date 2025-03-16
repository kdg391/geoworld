'use client'

import { Laptop, Moon, Sun } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

import useTheme from '@/hooks/useTheme.js'

import { useTranslation } from '@/i18n/client.js'

import type { Theme } from '@/types/index.js'

const Select = dynamic(() => import('../common/Select/index.js'))

const ThemeSelect = () => {
  const { theme, setTheme } = useTheme()

  const { t } = useTranslation('common')

  const themeOptions = useMemo(
    () => [
      {
        value: 'light',
        label: t('theme.light'),
        icon: <Sun size={18} />,
      },
      {
        value: 'dark',
        label: t('theme.dark'),
        icon: <Moon size={18} />,
      },
      {
        value: 'system',
        label: t('theme.system'),
        icon: <Laptop size={18} />,
      },
    ],
    [t],
  )

  if (!theme) return

  return (
    <Select
      items={themeOptions}
      label={t('theme')}
      showLabel={false}
      menuPlacement="top"
      onSelectedItemChange={async ({ selectedItem }) => {
        if (selectedItem === null) return
        if (selectedItem.value === theme) return

        setTheme(selectedItem.value as Theme)
      }}
      selectedItem={themeOptions.find((opt) => opt.value === theme)}
    />
  )
}

export default ThemeSelect
