import React, { createContext } from 'react'

import type { Theme } from '../types/index.js'

interface ContextValue {
    theme: Theme
    setTheme: React.Dispatch<React.SetStateAction<Theme>>
}

const ThemeContext = createContext<ContextValue | null>(null)

export default ThemeContext
