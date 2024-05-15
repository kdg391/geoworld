import { Link } from 'react-router-dom'

import styles from './Footer.module.css'

const Footer = () => (
    <footer className={styles.footer}>
        <div>
            <h4>Geography Guessing</h4>
            <p>React, Vite, Google Maps JavaScript API</p>
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

export default Footer
