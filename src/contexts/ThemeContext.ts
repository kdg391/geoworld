import { createContext } from 'react'

import type { Theme } from '../types/index.js'

export interface ContextValue {
  setTheme: React.Dispatch<React.SetStateAction<Theme>>
  theme: Theme | null
}

const ThemeContext = createContext<ContextValue | null>(null)

export default ThemeContext
