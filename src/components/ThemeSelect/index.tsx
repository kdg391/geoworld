'use client'

import { Laptop, Moon, Sun } from 'lucide-react'

import useTheme from '@/hooks/useTheme.ts'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { Theme } from '@/types/index.ts'

const themeOptions = [
  {
    value: 'light',
    label: '라이트',
    icon: <Sun size={18} />,
  },
  {
    value: 'dark',
    label: '다크',
    icon: <Moon size={18} />,
  },
  {
    value: 'system',
    label: '시스템',
    icon: <Laptop size={18} />,
  },
]

const ThemeSelect = () => {
  const { theme, setTheme } = useTheme()

  if (!theme) return

  const selectedTheme = themeOptions.find((t) => t.value === theme)

  return (
    <Select
      value={theme}
      onValueChange={(value) => {
        setTheme(value as Theme)
      }}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue>
          {selectedTheme && (
            <div className="flex items-center gap-2">
              {selectedTheme.icon}
              <span>{selectedTheme.label}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectGroup>
          {themeOptions.map((option) => (
            <SelectItem value={option.value} key={option.value}>
              <div className="flex items-center gap-2">
                {option.icon}
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default ThemeSelect
