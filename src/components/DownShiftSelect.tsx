import { useSelect, type UseSelectSelectedItemChange } from 'downshift'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { classNames } from '../utils/index.js'

import styles from './DownShiftSelect.module.css'

const cssPosition = {
    bottom: 'top',
    top: 'bottom',
}

interface Item {
    value: string
    label: string
    [key: string]: any
}

interface Props {
    defaultSelectedItem?: Item
    items: Item[]
    label?: string
    menuPlacement?: 'top' | 'bottom'
    onSelectedItemChange: (changes: UseSelectSelectedItemChange<Item>) => void
}

const DownShiftSelect: React.FC<Props> = ({
    defaultSelectedItem,
    items,
    label,
    menuPlacement = 'bottom',
    onSelectedItemChange,
}) => {
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
            <div className={styles.downShift}>
                <div
                    {...getToggleButtonProps({
                        className: styles.downShiftButton,
                    })}
                >
                    <div>
                        {selectedItem?.icon}
                        <span>{selectedItem?.label}</span>
                    </div>
                    {menuPlacement === 'top' ? (
                        <ChevronUp
                            size={16}
                            style={{
                                color: isOpen
                                    ? 'inherit'
                                    : 'var(--ds-indicator)',
                            }}
                        />
                    ) : (
                        <ChevronDown
                            size={16}
                            style={{
                                color: isOpen
                                    ? 'inherit'
                                    : 'var(--ds-indicator)',
                            }}
                        />
                    )}
                </div>
                <ul
                    {...getMenuProps({
                        className: styles.downShiftDropdown,
                        style: {
                            display: isOpen ? 'flex' : 'none',
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
                                                  : 'var(--ds)',
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
        </>
    )
}

export default DownShiftSelect
