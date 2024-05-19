import { Link } from 'react-router-dom'

import useTheme from '../hooks/useTheme.js'

import styles from './Footer.module.css'

import type { Theme } from '../types/index.js'

const Footer = () => {
    const themeContext = useTheme()

    return (
        <footer className={styles.footer}>
            <div>
                <h4>Geography Guessing</h4>
                <div>
                    <div>
                        <label htmlFor="theme">Theme</label>
                        <select
                            id="theme"
                            defaultValue={themeContext?.theme}
                            onChange={(event) => {
                                themeContext?.setTheme(
                                    event.target.value as Theme,
                                )
                            }}
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="language">Language</label>
                        <select id="language">
                            <option value="en">English</option>
                            <option value="ko">한국어</option>
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
                            Random StreetView
                        </Link>
                    </li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer
