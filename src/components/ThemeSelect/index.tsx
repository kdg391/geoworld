'use client'

import { Laptop, Moon, Sun } from 'lucide-react'
import dynamic from 'next/dynamic'

import useTheme from '@/hooks/useTheme.js'

import { useTranslation } from '@/i18n/client.js'

import type { Theme } from '@/types/index.js'

const Select = dynamic(() => import('../common/Select/index.js'))

const ThemeSelect = () => {
  const { theme, setTheme } = useTheme()

  const { t } = useTranslation('footer')

  if (!theme) return

  const themeOptions = [
    {
      value: 'light',
      label: t('translation:theme.light'),
      icon: <Sun size={18} />,
    },
    {
      value: 'dark',
      label: t('translation:theme.dark'),
      icon: <Moon size={18} />,
    },
    {
      value: 'system',
      label: t('translation:theme.system'),
      icon: <Laptop size={18} />,
    },
  ]

  return (
    <Select
      defaultSelectedItem={themeOptions.find((opt) => opt.value === theme)!}
      label={t('theme')}
      items={themeOptions}
      menuPlacement="top"
      onSelectedItemChange={async ({ selectedItem }) => {
        if (selectedItem.value === theme) return

        setTheme(selectedItem.value as Theme)
      }}
    />
  )
}

export default ThemeSelect
