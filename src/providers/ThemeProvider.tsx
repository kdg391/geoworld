'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import ThemeContext from '../contexts/ThemeContext.js'

import type { LightDark, Theme } from '../types/index.js'

interface Props {
  children: React.ReactNode
}

const getTheme = () => {
  if (typeof window === 'undefined') return null

  const theme = localStorage.getItem('theme')

  return theme as LightDark | null
}

const ThemeProvider = ({ children }: Props) => {
  const [theme, setThemeState] = useState<Theme | null>(
    () => getTheme() ?? 'system',
  )
  const [resolvedTheme, setResolvedTheme] = useState<LightDark | null>(() =>
    getTheme(),
  )

  const setTheme = useCallback(
    (value: Theme) => {
      if (!theme) return

      setThemeState(value)

      if (value === 'system') {
        if (localStorage.getItem('theme') !== null)
          localStorage.removeItem('theme')
      } else {
        try {
          localStorage.setItem('theme', value)
        } catch {
          //
        }
      }
    },
    [theme],
  )

  const onMediaChange = useCallback(
    (event: MediaQueryListEvent) => {
      const resolved = event.matches ? 'light' : 'dark'
      setResolvedTheme(resolved)

      if (theme === 'system') {
        document.documentElement.setAttribute('data-theme', resolved)
      }
    },
    [theme],
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: light)')

    media.addEventListener('change', onMediaChange)

    return () => media.removeEventListener('change', onMediaChange)
  }, [onMediaChange])

  useEffect(() => {
    const onStorageChange = (event: StorageEvent) => {
      if (event.key !== 'theme') return

      const value = event.newValue ?? 'system'

      if (!['light', 'dark', 'system'].includes(value)) return

      setTheme(value as Theme)
    }

    window.addEventListener('storage', onStorageChange)

    return () => window.addEventListener('storage', onStorageChange)
  }, [])

  useEffect(() => {
    if (!theme) return

    let newTheme = theme

    if (newTheme === 'system') {
      const { matches } = window.matchMedia('(prefers-color-scheme: light)')

      newTheme = matches ? 'light' : 'dark'
      setResolvedTheme(newTheme)
    }

    document.documentElement.setAttribute('data-theme', newTheme)
  }, [theme])

  const providerValue = useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme: theme === 'system' ? resolvedTheme : theme,
    }),
    [theme, setTheme, resolvedTheme],
  )

  return (
    <ThemeContext.Provider value={providerValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
