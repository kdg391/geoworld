import i18next, { type BackendModule, type CallbackError } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

const LazyLoad: BackendModule = {
    type: 'backend',
    init() {},
    read(language, namespace, callback) {
        fetch(`/geoworld/locales/${language}/${namespace}.json`)
            .then((res) => res.json())
            .then((res) => callback(null, res))
            .catch((err: CallbackError) => callback(err, null))
    },
    save() {},
    create() {},
}

i18next
    .use(LanguageDetector)
    .use(LazyLoad)
    .use(initReactI18next)
    .init({
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
