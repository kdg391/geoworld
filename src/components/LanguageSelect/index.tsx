'use client'

import dynamic from 'next/dynamic'

import {
  LOCALE_FLAGS,
  LOCALE_NAMES,
  SUPPORTED_LOCALES,
} from '@/constants/i18n.js'

import { useTranslation } from '@/i18n/client.js'
import { setLocale } from '@/i18n/server.js'

import type { Locales } from '@/types/index.js'

const Select = dynamic(() => import('../common/Select/index.js'))
const Twemoji = dynamic(() => import('../Twemoji.js'))

const LANGUAGE_OPTIONS = SUPPORTED_LOCALES.map((lang) => ({
  value: lang,
  label: LOCALE_NAMES[lang],
  icon: (
    <Twemoji
      emoji={LOCALE_FLAGS[lang]}
      alt={LOCALE_NAMES[lang]}
      width={16}
      height={16}
    />
  ),
}))

const LanguageSelect = () => {
  const { t, i18n } = useTranslation('common')

  return (
    <Select
      items={LANGUAGE_OPTIONS}
      label={t('language')}
      showLabel={false}
      menuPlacement="top"
      onSelectedItemChange={async ({ selectedItem }) => {
        if (selectedItem === null) return
        if (selectedItem.value === i18n.language) return

        i18n.changeLanguage(selectedItem.value)
        await setLocale(selectedItem.value as Locales)
      }}
      selectedItem={LANGUAGE_OPTIONS.find((opt) => opt.value === i18n.language)}
    />
  )
}

export default LanguageSelect
