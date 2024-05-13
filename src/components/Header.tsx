import { Link } from 'react-router-dom'

import styles from './Header.module.css'

const Header = () => (
    <header className={styles.header}>
        <h1>
            <Link to="/geography-guessing/">Geography Guessing</Link>
        </h1>
        <nav>
            <ul>
                <li>
                    <a
                        href="https://github.com/kdg391/geography-guessing"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Source Code
                    </a>
                </li>
            </ul>
        </nav>
    </header>
)

export default Header
