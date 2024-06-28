import { Menu, X } from 'lucide-react'
import { Suspense, lazy, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { classNames } from '../utils/index.js'

import styles from './Header.module.css'

const HeaderThemeSelect = lazy(() => import('./HeaderThemeSelect.js'))
const GitHub = lazy(() => import('./icons/GitHub.js'))

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        if (isMenuOpen) document.body.style.setProperty('overflow-y', 'hidden')
        else document.body.style.removeProperty('overflow-y')
    }, [isMenuOpen])

    return (
        <header
            className={classNames(styles.header, isMenuOpen ? 'active' : '')}
        >
            <div>
                <h2>
                    <Link to="/geoworld/">
                        <img
                            src="/geoworld/assets/icons/icon.avif"
                            width={18}
                            height={18}
                            alt="Logo"
                        />
                        GeoWorld
                    </Link>
                </h2>
            </div>

            <div className={styles['nav-wrapper']}>
                <nav>
                    <ul className={styles.links}>
                        <li>
                            <Link to="/geoworld/about">About</Link>
                        </li>
                    </ul>
                </nav>

                <Suspense>
                    <HeaderThemeSelect />
                </Suspense>

                <div className={styles['social-links']}>
                    <a
                        href="https://github.com/kdg391/geoworld"
                        target="_blank"
                        rel="noreferrer noopener"
                        className={styles['github-link']}
                        title="GitHub"
                    >
                        <Suspense>
                            <GitHub size={18} />
                        </Suspense>
                    </a>
                </div>

                <div
                    className={styles.backdrop}
                    onClick={() => {
                        setIsMenuOpen((o) => !o)
                    }}
                ></div>
            </div>

            <button
                className={styles.menu}
                aria-label="Menu"
                onClick={() => {
                    setIsMenuOpen((o) => !o)
                }}
            >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
        </header>
    )
}

export default Header
