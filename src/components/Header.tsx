import { useTranslation } from 'react-i18next'
import { FaGithub } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

import styles from './Header.module.css'

const Header = () => {
    const { t } = useTranslation()

    return (
        <header className={styles.header}>
            <div>
                <h1>
                    <Link
                        to="/geography-guessing/"
                        className={styles.anchorCenter}
                    >
                        <img
                            src="/geography-guessing/icon.png"
                            width={24}
                            height={24}
                            alt="logo"
                        />
                        Geography Guessing
                    </Link>
                </h1>
            </div>

            <nav>
                <ul>
                    <li>
                        <a href="#maps">{t('header.maps')}</a>
                    </li>
                </ul>
                <ul>
                    <li>
                        <a
                            href="https://github.com/kdg391/geography-guessing"
                            target="_blank"
                            rel="noreferrer"
                            className={styles.anchorCenter}
                            title="GitHub"
                        >
                            <FaGithub />
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header
