import { forwardRef } from 'react'

import { classNames } from '@/utils/index.js'

import styles from './index.module.css'

import './index.css'

const TextInput = forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className = '', ...props }, ref) => (
    <input
      {...props}
      ref={ref}
      className={classNames(styles.input, className)}
      spellCheck="false"
    />
  ),
)

export default TextInput
