'use client'

import { useContext } from 'react'

import ThemeContext, { type ContextValue } from '../contexts/ThemeContext.js'

const useTheme = () =>
  useContext(ThemeContext) ??
  ({
    theme: null,
    setTheme() {},
    resolvedTheme: null,
  } as ContextValue)

export default useTheme
