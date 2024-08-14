import { classNames } from '@/utils/index.js'

import styles from './index.module.css'

const NumberInput = ({
  className = '',
  ...props
}: React.ComponentProps<'input'>) => (
  <input
    type="number"
    pattern="[0-9]*"
    inputMode="numeric"
    autoComplete="off"
    className={classNames(styles['number-input'], className)}
    {...props}
  />
)

export default NumberInput
