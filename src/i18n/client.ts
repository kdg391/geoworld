'use client'

import { useEffect } from 'react'
import i18next, { type i18n } from 'i18next'
import {
  initReactI18next,
  useTranslation as useTransAlias,
} from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

import {
  DEFAULT_LOCALE,
  LANGUAGE_COOKIE,
  SUPPORTED_LOCALES,
} from '../constants/i18n.js'

import useLocale from '../hooks/useLocale.js'

import type { Locales } from '../types/index.js'

const runsOnServerSide = typeof window === 'undefined'

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (lang: string, ns: string) => import(`./locales/${lang}/${ns}.json`),
    ),
  )
  .init({
    debug: !runsOnServerSide && process.env.NODE_ENV === 'development',
    supportedLngs: SUPPORTED_LOCALES,
    fallbackLng: DEFAULT_LOCALE,
    ns: 'common',
    defaultNS: 'common',
    detection: {
      caches: ['cookie'],
      order: ['cookie'],
      lookupCookie: LANGUAGE_COOKIE,
    },
    load: 'currentOnly',
    preload: runsOnServerSide ? SUPPORTED_LOCALES : [],
  })

export function useTranslation(ns: string | string[]) {
  const lng = useLocale()

  const translator = useTransAlias(ns)
  const { i18n } = translator

  // Run content is being rendered on server side
  if (runsOnServerSide && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng)
  } else {
    // Use our custom implementation when running on client side
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCustomTranslationImplem(i18n, lng)
  }

  return translator
}

function useCustomTranslationImplem(i18n: i18n, lng: Locales) {
  // This effect changes the language of the application when the lng prop changes.
  useEffect(() => {
    if (!lng || i18n.resolvedLanguage === lng) return

    i18n.changeLanguage(lng)
  }, [lng, i18n])
}
