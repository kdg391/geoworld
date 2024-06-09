import styles from './Button.module.css'

import type React from 'react'

interface Props {
    className?: string
    type?: 'primary' | 'secondary'
}

const Button: React.FC<
    React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > &
        Props
> = ({ className, type = 'primary', ...props }) => (
    <button
        className={[styles.btn, styles[type], className].join(' ')}
        {...props}
    ></button>
)

export default Button
