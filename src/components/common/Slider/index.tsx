import { forwardRef } from 'react'

import { classNames } from '@/utils/index.js'

import styles from './index.module.css'

import './index.css'

const Slider = forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className = '', ...props }, ref) => (
    <input
      {...props}
      ref={ref}
      type="range"
      className={classNames(styles['slider-range'], className)}
    />
  ),
)

Slider.displayName = 'Slider'

export default Slider
