import { createContext } from 'react'

import { FALLBACK_LOCALE } from '../i18n/settings.js'

import type { Locales } from '../types/index.js'

const LocaleContext = createContext<Locales>(FALLBACK_LOCALE)

export default LocaleContext
