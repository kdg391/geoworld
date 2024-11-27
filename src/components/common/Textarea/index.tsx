import { forwardRef } from 'react'

import { classNames } from '@/utils/index.js'

import styles from './index.module.css'

import '../TextInput/index.css'

interface Props {
  fullWidth?: boolean
}

const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'> & Props
>(({ className = '', fullWidth = false, ...props }, ref) => (
  <textarea
    {...props}
    ref={ref}
    className={classNames(
      styles.textarea,
      fullWidth ? 'full-width' : '',
      className,
    )}
  />
))

Textarea.displayName = 'Textarea'

export default Textarea
