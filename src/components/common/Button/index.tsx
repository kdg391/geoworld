import dynamic from 'next/dynamic'

import { classNames } from './../../../utils/index.js'

import styles from './index.module.css'

const Spinner = dynamic(() => import('../Spinner/index.js'))

interface Props {
  className?: string
  full?: boolean
  isLoading?: boolean
  size?: 's' | 'm' | 'l'
  variant: 'primary' | 'secondary' | 'danger' | 'success' | 'gray'
}

const Button = ({
  className = '',
  full = false,
  isLoading = false,
  size,
  variant,
  children,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  Props) => (
  <button
    className={classNames(
      styles.button,
      full ? 'full' : '',
      isLoading ? 'is-loading' : '',
      size ? `size--${size}` : '',
      variant,
      className,
    )}
    {...props}
  >
    {isLoading && <Spinner size={16} />}
    {children}
  </button>
)

export default Button
