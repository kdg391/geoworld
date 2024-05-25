import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import useSettings from '../hooks/useSettings.js'
import useTheme from '../hooks/useTheme.js'

import styles from './Footer.module.css'

import type { DistanceUnit, Theme } from '../types/index.js'

const Footer = () => {
    const themeContext = useTheme()
    const settingsContext = useSettings()
    const { i18n, t } = useTranslation()

    return (
        <footer className={styles.footer}>
            <div>
                <h4>Geography Guessing</h4>
                <div>
                    <div>
                        <label htmlFor="theme">{t('footer.theme')}</label>
                        <select
                            id="theme"
                            defaultValue={themeContext?.theme}
                            onChange={(event) => {
                                themeContext?.setTheme(
                                    event.target.value as Theme,
                                )
                            }}
                        >
                            <option value="light">
                                {t('footer.themes.light')}
                            </option>
                            <option value="dark">
                                {t('footer.themes.dark')}
                            </option>
                            <option value="system">
                                {t('footer.themes.system')}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="language">{t('footer.language')}</label>
                        <select
                            id="language"
                            defaultValue={i18n.language}
                            onChange={(event) => {
                                i18n.changeLanguage(event.target.value)
                            }}
                        >
                            <option value="en">English</option>
                            <option value="ko">한국어</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="unit">{t('footer.distanceUnit')}</label>
                        <select
                            id="unit"
                            defaultValue={settingsContext?.distanceUnit}
                            onChange={(event) => {
                                settingsContext?.setDistanceUnit(
                                    event.target.value as DistanceUnit,
                                )
                            }}
                        >
                            <option value="imperial">
                                {t('footer.distanceUnits.imperial')}
                            </option>
                            <option value="metric">
                                {t('footer.distanceUnits.metric')}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <div className={styles.links}>
                <h4>Links</h4>
                <ul>
                    <li>
                        <Link to="/geography-guessing/location-picker">
                            Location Picker
                        </Link>
                    </li>
                    <li>
                        <Link to="/geography-guessing/random-streetview">
                            {t('footer.randomStreetView')}
                        </Link>
                    </li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer
