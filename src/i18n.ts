import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

i18next
    .use(LanguageDetector)
    .use(HttpApi)
    .use(initReactI18next)
    .init({
        backend: {
            loadPath: '/geography-guessing/locales/{{lng}}/{{ns}}.json',
        },
        detection: {
            lookupLocalStorage: 'lang',
        },
        debug: import.meta.env.DEV,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        supportedLngs: ['en', 'ko'],
    })
