import { classNames } from './../../../utils'

import styles from './index.module.css'

interface Props {
  className?: string
  size?: 'm' | 'l'
  variant: 'primary' | 'secondary'
}

const Button = ({
  className = '',
  size,
  variant,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  Props) => (
  <button
    className={classNames(
      styles.button,
      styles[variant],
      size ? `size--${size}` : '',
      className,
    )}
    {...props}
  />
)

export default Button
