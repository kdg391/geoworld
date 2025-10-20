'use client'

import LocaleContext from '../contexts/LocaleContext.ts'

import type { Locales } from '../types/index.ts'

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
