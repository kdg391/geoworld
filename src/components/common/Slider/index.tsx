import { classNames } from '../../../utils/index.js'

import styles from './index.module.css'
import './index.css'

const Slider = ({
  className = '',
  ...props
}: React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => (
  <input
    type="range"
    className={classNames(styles['slider-range'], className)}
    {...props}
  />
)

export default Slider
