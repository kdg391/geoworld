import { FLAG_ENOJIS } from './index.js'

export const DEFAULT_LOCALE = 'en'
export const SUPPORTED_LOCALES = ['en', 'ko'] as const

export const LOCALE_NAMES = {
  en: 'English',
  ko: '한국어',
}

export const LOCALE_FLAGS = {
  en: FLAG_ENOJIS.us,
  ko: FLAG_ENOJIS.kr,
}

export const LANGUAGE_COOKIE = 'lang'
