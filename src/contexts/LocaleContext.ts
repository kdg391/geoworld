import { createContext } from 'react'

import { DEFAULT_LOCALE } from '../constants/i18n.js'

import type { Locales } from '../types/index.js'

const LocaleContext = createContext<Locales>(DEFAULT_LOCALE)

export default LocaleContext
