import { forwardRef } from 'react'

import { classNames } from '@/utils/index.js'

import styles from './index.module.css'

import Spinner from '../Spinner/index.js'

import type React from 'react'

type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>['ref']

type AsProp<C extends React.ElementType> = {
  as?: C
}

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P)

type PolymorphicComponentProp<
  C extends React.ElementType,
  // eslint-disable-next-line
  Props = {},
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>

type PolymorphicComponentPropWithRef<
  C extends React.ElementType,
  // eslint-disable-next-line
  Props = {},
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> }

type ButtonProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  {
    full?: boolean
    isLoading?: boolean
    leftIcon?: React.ReactNode
    size?: 's' | 'm' | 'l'
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'gray'
  }
>

type ButtonComponent = (<C extends React.ElementType = 'button'>(
  props: ButtonProps<C>,
) => React.ReactNode) & {
  displayName?: string
}

const Button: ButtonComponent = forwardRef(
  // eslint-disable-next-line
  // @ts-ignore
  <C extends React.ElementType = 'button'>(
    {
      as,
      children,
      className,
      full = false,
      isLoading = false,
      leftIcon,
      size,
      variant,
      ...props
    }: ButtonProps<C>,
    // eslint-disable-next-line
    _: PolymorphicRef<C>,
  ) => {
    const Element = as ?? 'button'

    return (
      <Element
        className={classNames(
          styles.button,
          full ? 'full' : '',
          isLoading ? 'is-loading' : '',
          size ? `size--${size}` : '',
          variant ?? '',
          className ?? '',
        )}
        {...props}
      >
        {isLoading ? <Spinner theme="dark" size={16} /> : leftIcon}
        {children}
      </Element>
    )
  },
)

Button.displayName = 'Button'

export default Button
