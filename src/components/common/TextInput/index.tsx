import { classNames } from '@/utils/index.js'

import styles from './index.module.css'
import './index.css'

const TextInput = ({
  className = '',
  ...props
}: React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => (
  <input
    className={classNames(styles.input, className)}
    spellCheck="false"
    {...props}
  />
)

export default TextInput
