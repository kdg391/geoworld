import { FLAG_ENOJIS } from './index.ts'

export const DEFAULT_LOCALE = 'ko'
export const SUPPORTED_LOCALES = ['ko'] as const

export const LOCALE_NAMES = {
  ko: '한국어',
}

export const LOCALE_FLAGS = {
  ko: FLAG_ENOJIS.kr,
}

export const LANGUAGE_COOKIE = 'locale'
