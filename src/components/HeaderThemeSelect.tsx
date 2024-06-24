import { useSelect } from 'downshift'
import { ChevronDown, Laptop, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import useTheme from '../hooks/useTheme.js'

import { classNames } from '../utils/index.js'

import styles from './Header.module.css'

import type { Theme } from '../types/index.js'

const HeaderThemeSelect: React.FC = () => {
    const { t } = useTranslation()
    const { setTheme, theme } = useTheme()

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
        defaultSelectedItem: themeOptions.find((opt) => opt.value === theme),
        items: themeOptions,
        itemToString: (item) => item?.label ?? '',
        onSelectedItemChange: ({ selectedItem }) => {
            if (selectedItem.value === theme) return

            setTheme(selectedItem.value as Theme)
        },
    })

    return (
        <div
            className={classNames(styles['theme-select'], isOpen ? 'open' : '')}
        >
            <label {...getLabelProps()} hidden aria-hidden="true">
                {t('footer.theme')}
            </label>
            <div
                {...getToggleButtonProps({
                    className: styles['theme-button'],
                })}
            >
                <div>
                    {selectedItem?.icon}
                    <span>{t('footer.theme')}</span>
                </div>
                <ChevronDown size={18} className={styles.arrow} />
            </div>
            <ul
                {...getMenuProps({
                    className: styles['theme-dropdown'],
                })}
            >
                {isOpen
                    ? themeOptions.map((item, index) => (
                          <li
                              key={item.value}
                              {...getItemProps({
                                  className: classNames(
                                      highlightedIndex === index
                                          ? 'focused'
                                          : '',
                                      selectedItem?.value === item.value
                                          ? 'selected'
                                          : '',
                                  ),
                                  index,
                                  item,
                              })}
                          >
                              {item?.icon}
                              <span>{item.label}</span>
                          </li>
                      ))
                    : null}
            </ul>
        </div>
    )
}

export default HeaderThemeSelect
