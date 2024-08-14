'use client'

import { useSelect, type UseSelectSelectedItemChange } from 'downshift'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { classNames } from '@/utils/index.js'

import styles from './index.module.css'
import './index.css'

const cssPosition = {
  bottom: 'top',
  top: 'bottom',
}

interface Item {
  value: string
  label: string
  [key: string]: string | React.ReactNode
}

interface Props {
  defaultSelectedItem?: Item
  items: Item[]
  label?: string
  menuPlacement?: 'top' | 'bottom'
  onSelectedItemChange: (changes: UseSelectSelectedItemChange<Item>) => void
}

const Select = ({
  defaultSelectedItem,
  items,
  label,
  menuPlacement = 'bottom',
  onSelectedItemChange,
}: Props) => {
  const {
    getItemProps,
    getLabelProps,
    getMenuProps,
    getToggleButtonProps,
    highlightedIndex,
    isOpen,
    selectedItem,
  } = useSelect({
    defaultSelectedItem,
    items,
    itemToString: (item: Item | null) => item?.label ?? '',
    onSelectedItemChange,
  })

  return (
    <>
      {label && <label {...getLabelProps()}>{label}</label>}
      <div className={classNames(styles.downshift, isOpen ? 'open' : '')}>
        <div
          {...getToggleButtonProps({
            className: styles['downshift-button'],
          })}
        >
          <div>
            {selectedItem?.icon}
            <span>{selectedItem?.label}</span>
          </div>
          {menuPlacement === 'top' ? (
            <ChevronUp size={16} className="chevron" />
          ) : (
            <ChevronDown size={16} className="chevron" />
          )}
        </div>
        <ul
          {...getMenuProps({
            className: styles['downshift-dropdown'],
            style: {
              [cssPosition[menuPlacement]]: '100%',
            },
          })}
        >
          {isOpen
            ? items.map((item, index) => (
                <li
                  key={item.value}
                  {...getItemProps({
                    className: classNames(
                      highlightedIndex === index ? 'focused' : '',
                      selectedItem?.value === item.value ? 'selected' : '',
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
    </>
  )
}

export default Select
