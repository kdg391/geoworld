import { useSelect } from 'downshift'
import { ChevronDown, Laptop, Menu, Moon, Sun, X } from 'lucide-react'
import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import useTheme from '../hooks/useTheme.js'

import { classNames } from '../utils/index.js'

import styles from './Header.module.css'

import type { Theme } from '../types/index.js'

const GitHub = lazy(() => import('./icons/GitHub.js'))

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const containerRef = useRef<HTMLElement | null>(null)

    const { t } = useTranslation()
    const themeContext = useTheme()

    const themeOptions = [
        {
            value: 'light',
            label: t('footer.themes.light'),
            icon: <Sun size={18} />,
        },
        {
            value: 'dark',
            label: t('footer.themes.dark'),
            icon: <Moon size={18} />,
        },
        {
            value: 'system',
            label: t('footer.themes.system'),
            icon: <Laptop size={18} />,
        },
    ]

    const {
        getItemProps,
        getLabelProps,
        getMenuProps,
        getToggleButtonProps,
        highlightedIndex,
        isOpen,
        selectedItem,
    } = useSelect({
        defaultSelectedItem: themeOptions.find(
            (opt) => opt.value === themeContext?.theme,
        ),
        items: themeOptions,
        itemToString: (item) => item?.label ?? '',
        onSelectedItemChange: ({ selectedItem }) => {
            if (selectedItem.value === themeContext?.theme) return

            themeContext?.setTheme(selectedItem.value as Theme)
        },
    })

    useEffect(() => {
        if (isMenuOpen) document.body.style.setProperty('overflow-y', 'hidden')
        else document.body.style.removeProperty('overflow-y')
    }, [isMenuOpen])

    return (
        <header
            className={classNames(styles.header, isMenuOpen ? 'active' : '')}
            ref={containerRef}
        >
            <div>
                <h2>
                    <Link to="/geoworld/">
                        <img
                            src="/geoworld/icon.avif"
                            width={20}
                            height={20}
                            alt="Logo"
                        />
                        GeoWorld
                    </Link>
                </h2>
            </div>

            <div className={styles.navWrapper}>
                <nav>
                    <ul className={styles.links}>
                        <li>
                            <Link to="/geoworld/about">About</Link>
                        </li>
                    </ul>
                </nav>

                <div className={styles.themeSelect}>
                    <label {...getLabelProps()} hidden aria-hidden="true">
                        {t('footer.theme')}
                    </label>
                    <div
                        {...getToggleButtonProps({
                            className: styles.themeButton,
                        })}
                    >
                        <div>
                            {selectedItem?.icon}
                            <span>{t('footer.theme')}</span>
                        </div>
                        <ChevronDown size={18} className="arrow" />
                    </div>
                    <ul
                        {...getMenuProps({
                            className: styles.themeDropdown,
                            style: {
                                display: isOpen ? 'flex' : 'none',
                            },
                        })}
                    >
                        {isOpen
                            ? themeOptions.map((item, index) => (
                                  <li
                                      key={item.value}
                                      {...getItemProps({
                                          className: classNames(
                                              highlightedIndex === index
                                                  ? 'hovered'
                                                  : '',
                                              selectedItem?.value === item.value
                                                  ? 'selected'
                                                  : '',
                                          ),
                                          index,
                                          item,
                                          style: {
                                              backgroundColor:
                                                  highlightedIndex === index
                                                      ? 'var(--ds-selected)'
                                                      : 'var(--bg)',
                                          },
                                      })}
                                  >
                                      {item?.icon}
                                      <span>{item.label}</span>
                                  </li>
                              ))
                            : null}
                    </ul>
                </div>
                <div className={styles.socialLinks}>
                    <a
                        href="https://github.com/kdg391/geoworld"
                        target="_blank"
                        rel="noreferrer noopener"
                        className={styles.githubLink}
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
