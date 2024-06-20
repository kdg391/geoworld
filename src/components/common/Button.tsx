import styles from './Button.module.css'

interface Props {
    className?: string
    size?: 'm' | 'l'
    variant: 'primary' | 'secondary'
}

const Button: React.FC<
    React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > &
        Props
> = ({ className = '', size = 'l', variant, ...props }) => (
    <button
        className={[styles.button, styles[variant], size, className]
            .filter((c) => c !== '')
            .join(' ')}
        {...props}
    ></button>
)

export default Button
