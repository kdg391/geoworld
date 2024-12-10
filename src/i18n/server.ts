'use server'

import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { cookies } from 'next/headers'
import { initReactI18next } from 'react-i18next/initReactI18next'

import {
  DEFAULT_LOCALE,
  LANGUAGE_COOKIE,
  SUPPORTED_LOCALES,
} from '../constants/i18n.js'

import type { Locales } from '../types/index.js'

async function initI18next(lng: Locales, namespace: string | string[]) {
  const instance = createInstance()

  await instance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (lang: string, ns: string) => import(`./locales/${lang}/${ns}.json`),
      ),
    )
    .init({
      supportedLngs: SUPPORTED_LOCALES,
      fallbackLng: DEFAULT_LOCALE,
      lng,
      ns: namespace,
      defaultNS: 'common',
      load: 'currentOnly',
    })

  return instance
}

export async function createTranslation(ns: string | string[]) {
  const lang = await getLocale()
  const i18nextInstance = await initI18next(lang, ns)

  return {
    t: i18nextInstance.getFixedT(null, Array.isArray(ns) ? ns[0] : ns),
  }
}

export async function getLocale() {
  const cookieStore = await cookies()

  const locale = cookieStore.get(LANGUAGE_COOKIE)?.value ?? DEFAULT_LOCALE

  return locale as Locales
}

export async function setLocale(locale: Locales) {
  'use server'

  const cookieStore = await cookies()

  cookieStore.set(LANGUAGE_COOKIE, locale)
}
