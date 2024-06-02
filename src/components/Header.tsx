import { useTranslation } from 'react-i18next'
import { FaGithub } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

import styles from './Header.module.css'

const Header = () => {
    const { t } = useTranslation()

    return (
        <header className={styles.header}>
            <div>
                <h2>
                    <Link
                        to="/geography-guessing/"
                        className={styles.anchorCenter}
                    >
                        <img
                            src="/geography-guessing/icon.png"
                            width={20}
                            height={20}
                            alt="logo"
                        />
                        Geography Guessing
                    </Link>
                </h2>
            </div>

            <nav>
                <ul>
                    <li>
                        <a href="#official-maps">{t('header.officialMaps')}</a>
                    </li>
                </ul>
                <ul>
                    <li>
                        <a
                            href="https://github.com/kdg391/geography-guessing"
                            target="_blank"
                            rel="noreferrer noopener"
                            className={styles.anchorCenter}
                            title="GitHub"
                        >
                            <FaGithub size={18} />
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header
