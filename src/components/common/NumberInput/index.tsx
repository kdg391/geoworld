import { forwardRef } from 'react'

import { classNames } from '@/utils/index.js'

import styles from './index.module.css'

const NumberInput = forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className = '', ...props }, ref) => (
    <input
      {...props}
      ref={ref}
      type="number"
      pattern="[0-9]*"
      inputMode="numeric"
      autoComplete="off"
      className={classNames(styles['number-input'], className)}
    />
  ),
)

NumberInput.displayName = 'NumberInput'

export default NumberInput
