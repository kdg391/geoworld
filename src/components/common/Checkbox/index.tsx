import { forwardRef } from 'react'

import { classNames } from '@/utils/index.js'

import styles from './index.module.css'

const Checkbox = forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className = '', defaultChecked, id, onChange, ...props }) => (
    <input
      {...props}
      type="checkbox"
      id={id}
      defaultChecked={defaultChecked}
      onChange={onChange}
      className={classNames(styles.checkbox, className)}
    />
  ),
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
