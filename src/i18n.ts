import i18next, { type BackendModule } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
// import HttpApi from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

const LazyImport: BackendModule = {
    type: 'backend',
    init() {},
    read(language, namespace, callback) {
        fetch(`/geoworld/locales/${language}/${namespace}.json`)
            .then((res) => res.json())
            .then((res) => {
                callback(null, res)
            })
    },
    save() {},
    create() {},
}

i18next
    .use(LanguageDetector)
    .use(LazyImport)
    .use(initReactI18next)
    .init({
        // backend: {
        //     loadPath: '/geoworld/locales/{{lng}}/{{ns}}.json',
        // },
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
