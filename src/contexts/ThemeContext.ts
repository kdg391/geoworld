import { createContext } from 'react'

import type { LightDark, Theme } from '../types/index.js'

export interface ContextValue {
  theme: Theme | null
  setTheme: (value: Theme) => void
  resolvedTheme: LightDark | null
}

const ThemeContext = createContext<ContextValue | null>(null)

export default ThemeContext
