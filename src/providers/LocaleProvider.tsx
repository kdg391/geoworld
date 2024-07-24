'use client'

import LocaleContext from '../contexts/LocaleContext.js'

import type { Locales } from '../types/index.js'

export default function LocaleProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: Locales
}) {
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}
