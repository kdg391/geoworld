import { useCallback, useEffect, useMemo, useState } from 'react'

import ThemeContext from '../contexts/ThemeContext.js'

import type { Theme } from '../types/index.js'

interface Props {
    children: React.ReactNode
}

const ThemeProvider: React.FC<Props> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem('theme') as Theme | null) ?? 'system',
    )

    const onMediaChange = useCallback(
        (event: MediaQueryListEvent) => {
            if (theme === 'system') {
                document.documentElement.setAttribute(
                    'data-theme',
                    event.matches ? 'light' : 'dark',
                )
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
        let newTheme = theme

        if (newTheme === 'system') {
            const { matches } = window.matchMedia(
                '(prefers-color-scheme: light)',
            )

            newTheme = matches ? 'light' : 'dark'

            if (localStorage.getItem('theme') !== null) {
                localStorage.removeItem('theme')
            }
        } else {
            try {
                localStorage.setItem('theme', theme)
            } catch {
                // empty
            }
        }

        document.documentElement.setAttribute('data-theme', newTheme)
    }, [theme])

    const providerValue = useMemo(
        () => ({
            theme,
            setTheme,
        }),
        [theme],
    )

    return (
        <ThemeContext.Provider value={providerValue}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider
