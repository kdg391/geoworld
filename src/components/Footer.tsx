import { Sun, Moon, Laptop } from 'lucide-react'
import { lazy, Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Select, { type GroupBase, type StylesConfig } from 'react-select'

import useSettings from '../hooks/useSettings.js'
import useTheme from '../hooks/useTheme.js'

import styles from './Footer.module.css'

import type { DistanceUnit, Theme } from '../types/index.js'

const Twemoji = lazy(() => import('./Twemoji.js'))

const Footer = () => {
    const themeContext = useTheme()
    const settingsContext = useSettings()
    const { i18n, t } = useTranslation()

    const themeOptions = [
        {
            value: 'light',
            label: t('footer.themes.light'),
            icon: <Sun size={20} />,
        },
        {
            value: 'dark',
            label: t('footer.themes.dark'),
            icon: <Moon size={20} />,
        },
        {
            value: 'system',
            label: t('footer.themes.system'),
            icon: <Laptop size={20} />,
        },
    ]

    const languageOptions = [
        {
            value: 'en',
            label: 'English',
            emoji: '🇺🇸',
        },
        {
            value: 'ko',
            label: '한국어',
            emoji: '🇰🇷',
        },
    ]

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

    const selectStyles: StylesConfig = {
        control: (base) => ({
            ...base,
            backgroundColor: 'var(--bg-color)',
        }),
        indicatorSeparator: () => ({
            display: 'none',
        }),
        menuList: (base) => ({
            ...base,
            backgroundColor: 'var(--selector-bg)',
        }),
        option: (base, props) => ({
            ...base,
            backgroundColor: props.isFocused
                ? 'var(--selector-focused-bg)'
                : props.isSelected
                ? 'var(--selector-selected-bg)'
                : 'var(--selector-bg)',
            color: props.isFocused
                ? 'var(--selector-focused-color)'
                : props.isSelected
                ? 'var(--selector-selected-color)'
                : 'var(--selector-color)',
            ':active': {
                backgroundColor: 'var(--selector-active-bg)',
                color: 'var(--selector-active-color)',
            },
            ':hover': {
                backgroundColor: 'var(--selector-hovered-bg)',
                color: 'var(--selector-hovered-color)',
            },
        }),
        singleValue: (base) => ({
            ...base,
            color: 'var(--color)',
        }),
    }

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
                        <div className={styles.settingTitle}>
                            <label id="theme-aria-label" htmlFor="theme">
                                {t('footer.theme')}
                            </label>
                        </div>
                        <Select
                            aria-labelledby="theme-aria-label"
                            inputId="theme"
                            className="theme-select"
                            classNamePrefix="theme-selector"
                            isSearchable={false}
                            value={themeOptions.find(
                                (opt) => opt.value === themeContext?.theme,
                            )}
                            options={themeOptions}
                            onChange={(event) => {
                                if (!event) return

                                themeContext?.setTheme(event.value as Theme)
                            }}
                            formatOptionLabel={(opt) => (
                                <div className={styles.optionLabel}>
                                    <span className={styles.optionLabelImg}>
                                        {opt.icon}
                                    </span>
                                    <span>{opt.label}</span>
                                </div>
                            )}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={
                                selectStyles as StylesConfig<
                                    (typeof themeOptions)[number],
                                    false,
                                    GroupBase<(typeof themeOptions)[number]>
                                >
                            }
                        />
                    </div>
                    <div>
                        <div className={styles.settingTitle}>
                            <label id="language-aria-label" htmlFor="language">
                                {t('footer.language')}
                            </label>
                        </div>
                        <Select
                            aria-labelledby="language-aria-label"
                            inputId="language"
                            className="language-select react-select"
                            classNamePrefix="language-selector"
                            isSearchable={false}
                            value={languageOptions.find(
                                (opt) => opt.value === i18n.language,
                            )}
                            options={languageOptions}
                            onChange={(event) => {
                                if (!event) return

                                i18n.changeLanguage(event.value)
                            }}
                            formatOptionLabel={(opt) => (
                                <div className={styles.optionLabel}>
                                    <span className={styles.optionLabelImg}>
                                        <Suspense>
                                            <Twemoji
                                                emoji={opt.emoji}
                                                width={16}
                                                height={16}
                                                alt={opt.label}
                                            />
                                        </Suspense>
                                    </span>
                                    <span>{opt.label}</span>
                                </div>
                            )}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={
                                selectStyles as StylesConfig<
                                    (typeof languageOptions)[number],
                                    false,
                                    GroupBase<(typeof languageOptions)[number]>
                                >
                            }
                        />
                    </div>
                    <div>
                        <div className={styles.settingTitle}>
                            <label
                                id="distance-unit-aria-label"
                                htmlFor="distance-unit"
                            >
                                {t('footer.distanceUnit')}
                            </label>
                        </div>
                        <Select
                            aria-labelledby="distance-unit-aria-label"
                            inputId="distance-unit"
                            className="distance-unit-select react-select"
                            classNamePrefix="distance-unit-selector"
                            isSearchable={false}
                            value={distanceUnitOptions.find(
                                (opt) =>
                                    opt.value === settingsContext?.distanceUnit,
                            )}
                            options={distanceUnitOptions}
                            onChange={(event) => {
                                if (!event) return

                                settingsContext?.setDistanceUnit(
                                    event.value as DistanceUnit,
                                )
                            }}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={
                                selectStyles as StylesConfig<
                                    (typeof distanceUnitOptions)[number],
                                    false,
                                    GroupBase<
                                        (typeof distanceUnitOptions)[number]
                                    >
                                >
                            }
                        />
                    </div>
                </div>
            </div>
            <div className={styles.links}>
                <h4>{t('footer.links')}</h4>
                <ul>
                    <li>
                        <Link to="/geography-guessing/location-picker">
                            {t('footer.linkTexts.locationPicker')}
                        </Link>
                    </li>
                    <li>
                        <Link to="/geography-guessing/random-streetview">
                            {t('footer.linkTexts.randomStreetView')}
                        </Link>
                    </li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer
