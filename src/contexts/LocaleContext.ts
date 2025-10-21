import { createContext } from 'react'

import { DEFAULT_LOCALE } from '../constants/i18n.ts'

import type { Locales } from '../types/index.ts'

const LocaleContext = createContext<Locales>(DEFAULT_LOCALE)

export default LocaleContext
