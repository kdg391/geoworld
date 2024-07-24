import { LANGUAGES } from '../constants/index.js'

import type { InitOptions } from 'i18next'

export const FALLBACK_LOCALE = 'en'

export const LANGUAGE_COOKIE = 'lang'

export function getOptions(
  lng = FALLBACK_LOCALE,
  namespace = 'translation',
): InitOptions {
  return {
    debug:
      typeof window !== 'undefined' && process.env.NODE_ENV === 'development',
    supportedLngs: LANGUAGES,
    fallbackLng: FALLBACK_LOCALE,
    lng,
    ns: namespace,
  }
}
