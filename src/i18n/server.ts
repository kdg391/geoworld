'use server'

import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { cookies } from 'next/headers'

import { FALLBACK_LOCALE, LANGUAGE_COOKIE } from './settings.js'

import { LANGUAGES } from '../constants/index.js'

import type { Locales } from '../types/index.js'

async function initI18next(lng: Locales, namespace: string | string[]) {
  const i18nInstance = createInstance()

  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (lang: string, ns: string) => import(`./locales/${lang}/${ns}.json`),
      ),
    )
    .init({
      supportedLngs: LANGUAGES,
      fallbackLng: FALLBACK_LOCALE,
      lng,
      ns: namespace,
    })

  return i18nInstance
}

export async function createTranslation(ns: string | string[]) {
  const lang = await getLocale()
  const i18nextInstance = await initI18next(lang, ns)

  return {
    t: i18nextInstance.getFixedT(lang, Array.isArray(ns) ? ns[0] : ns),
  }
}

export async function getLocale() {
  return (cookies().get(LANGUAGE_COOKIE)?.value ?? FALLBACK_LOCALE) as Locales
}

export async function setLocale(locale: Locales) {
  cookies().set(LANGUAGE_COOKIE, locale)
}
