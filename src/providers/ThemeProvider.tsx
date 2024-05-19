import React, { useEffect, useState } from 'react'

import ThemeContext from '../contexts/ThemeContext.js'

import type { Theme } from '../types/index.js'

interface Props {
    children: React.ReactNode
}

const ThemeProvider: React.FC<Props> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem('theme') as Theme | null) ?? 'system',
    )

    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: light)')

        const onChange = (event: MediaQueryListEvent) => {
            if (theme === 'system') {
                document.body.setAttribute(
                    'data-theme',
                    event.matches ? 'light' : 'dark',
                )
            }
        }

        media.addEventListener('change', onChange)

        return () => {
            media.removeEventListener('change', onChange)
        }
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
            } catch {}
        }

        document.body.setAttribute('data-theme', newTheme)
    }, [theme])

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider
