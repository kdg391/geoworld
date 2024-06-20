import { lazy, Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import useSettings from '../hooks/useSettings.js'

import styles from './Footer.module.css'

import type { DistanceUnit } from '../types/index.js'
import {
    LANGUAGE_FLAGS,
    LANGUAGE_NAMES,
    LANGUAGES,
} from '../constants/index.js'

const DownShiftSelect = lazy(() => import('./DownShiftSelect.js'))
const Twemoji = lazy(() => import('./Twemoji.js'))

const LANGUAGE_OPTIONS = LANGUAGES.map((lang) => ({
    value: lang,
    label: LANGUAGE_NAMES[lang],
    icon: (
        <Suspense>
            <Twemoji
                emoji={LANGUAGE_FLAGS[lang]}
                alt={LANGUAGE_NAMES[lang]}
                width={16}
                height={16}
            />
        </Suspense>
    ),
}))

const Footer = () => {
    const settingsContext = useSettings()
    const { i18n, t } = useTranslation()

    const distanceUnitOptions = [
        {
            value: 'imperial',
            label: t('footer.distanceUnits.imperial'),
        },
        {
            value: 'metric',
            label: t('footer.distanceUnits.metric'),
        },
    ]

    useEffect(() => {
        document.documentElement.setAttribute('lang', i18n.language)

        const onLanguageChanged = (lang: string) => {
            document.documentElement.setAttribute('lang', lang)
        }

        i18n.on('languageChanged', onLanguageChanged)

        return () => {
            i18n.off('languageChanged', onLanguageChanged)
        }
    }, [])

    return (
        <footer className={styles.footer}>
            <div>
                <h3>GeoWorld</h3>
                <div className={styles.settings}>
                    <div>
                        <Suspense>
                            <DownShiftSelect
                                defaultSelectedItem={
                                    LANGUAGE_OPTIONS.find(
                                        (opt) => opt.value === i18n.language,
                                    )!
                                }
                                label={t('footer.language')}
                                items={LANGUAGE_OPTIONS}
                                menuPlacement="top"
                                onSelectedItemChange={({ selectedItem }) => {
                                    if (selectedItem.value === i18n.language)
                                        return

                                    i18n.changeLanguage(selectedItem.value)
                                }}
                            />
                        </Suspense>
                    </div>
                    <div>
                        <Suspense>
                            <DownShiftSelect
                                defaultSelectedItem={
                                    distanceUnitOptions.find(
                                        (opt) =>
                                            opt.value ===
                                            settingsContext?.distanceUnit,
                                    )!
                                }
                                label={t('footer.distanceUnit')}
                                items={distanceUnitOptions}
                                menuPlacement="top"
                                onSelectedItemChange={({ selectedItem }) => {
                                    settingsContext?.setDistanceUnit(
                                        selectedItem.value as DistanceUnit,
                                    )
                                }}
                            />
                        </Suspense>
                    </div>
                </div>
            </div>
            <div>
                <h4>{t('footer.links')}</h4>
                <ul className={styles.links}>
                    <li>
                        <Link to="/geoworld/location-picker">
                            {t('footer.linkTexts.locationPicker')}
                        </Link>
                    </li>
                    <li>
                        <Link to="/geoworld/random-streetview">
                            {t('footer.linkTexts.randomStreetView')}
                        </Link>
                    </li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer
