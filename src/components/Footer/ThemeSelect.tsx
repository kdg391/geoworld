'use client'

import { useSelect } from 'downshift'
import { ChevronDown, Laptop, Moon, Sun } from 'lucide-react'

import useTheme from '../../hooks/useTheme.js'

import { useTranslation } from '../../i18n/client.js'

import { classNames } from '../../utils/index.js'

import styles from './ThemeSelect.module.css'

import type { Theme } from '../../types/index.js'

const ThemeSelect = () => {
  const { setTheme, theme } = useTheme()
  const { t } = useTranslation('translation')

  const themeOptions = [
    {
      value: 'light',
      label: t('theme.light'),
      icon: <Sun size={18} />,
    },
    {
      value: 'dark',
      label: t('theme.dark'),
      icon: <Moon size={18} />,
    },
    {
      value: 'system',
      label: t('theme.system'),
      icon: <Laptop size={18} />,
    },
  ]

  const {
    getItemProps,
    getLabelProps,
    getMenuProps,
    getToggleButtonProps,
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
    <div className={classNames(styles['theme-select'], isOpen ? 'open' : '')}>
      <label
        {...getLabelProps({
          className: 'sr-only',
        })}
      >
        {t('footer.theme')}
      </label>
      <div
        {...getToggleButtonProps({
          className: styles['theme-button'],
        })}
        title={t('footer.theme')}
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
                  className:
                    selectedItem?.value === item.value ? 'selected' : '',
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

export default ThemeSelect
