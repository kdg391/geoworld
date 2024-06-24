import { classNames } from '../../utils/index.js'

import styles from './Slider.module.css'

const Slider: React.FC<
    React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    >
> = ({ className = '', ...props }) => (
    <input
        type="range"
        className={classNames(styles['slider-range'], className)}
        {...props}
    />
)

export default Slider
