import { FLAG_ENOJIS } from './index.js'

export const DEFAULT_LOCALE = 'en-US'
export const SUPPORTED_LOCALES = ['en-US', 'ko'] as const

export const LOCALE_NAMES = {
  'en-US': 'English',
  ko: '한국어',
}

export const LOCALE_FLAGS = {
  'en-US': FLAG_ENOJIS.us,
  ko: FLAG_ENOJIS.kr,
}

export const LANGUAGE_COOKIE = 'locale'
