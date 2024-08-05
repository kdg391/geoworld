'use server'

import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { cookies, headers } from 'next/headers'

import {
  DEFAULT_LOCALE,
  LANGUAGE_COOKIE,
  SUPPORTED_LOCALES,
} from '../constants/i18n.js'

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
      supportedLngs: SUPPORTED_LOCALES,
      fallbackLng: DEFAULT_LOCALE,
      lng,
      ns: namespace,
      defaultNS: 'translation',
    })

  return i18nInstance
}

export async function createTranslation(ns: string | string[]) {
  const lang = await getLocale()
  const i18nextInstance = await initI18next(lang, ns)

  return {
    t: i18nextInstance.getFixedT(lang, ns),
  }
}

export async function getLocale() {
  let locale = cookies().get(LANGUAGE_COOKIE)?.value

  if (!locale) {
    locale = headers().get('x-next-locale') ?? DEFAULT_LOCALE
  }

  return locale as Locales
}

export async function setLocale(locale: Locales) {
  cookies().set(LANGUAGE_COOKIE, locale)
}
