import { forwardRef } from 'react'

import { classNames } from '@/utils/index.js'

import styles from './index.module.css'

import './index.css'

interface Props {
  fullWidth?: boolean
}

const TextInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & Props
>(({ className = '', fullWidth = false, ...props }, ref) => (
  <input
    {...props}
    ref={ref}
    className={classNames(
      styles.input,
      fullWidth ? 'full-width' : '',
      className,
    )}
    spellCheck="false"
  />
))

TextInput.displayName = 'TextInput'

export default TextInput
