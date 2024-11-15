import { forwardRef } from 'react'

import { classNames } from '@/utils/index.js'

import styles from './index.module.css'

import '../TextInput/index.css'

const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className = '', ...props }, ref) => (
  <textarea
    {...props}
    ref={ref}
    className={classNames(className, styles.textarea)}
  />
))

export default Textarea
