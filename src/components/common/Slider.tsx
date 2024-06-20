import styles from './Slider.module.css'

const Slider: React.FC<
    React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    >
> = ({ className, ...props }) => (
    <input
        type="range"
        className={[styles.sliderRange, className].join(' ')}
        {...props}
    />
)

export default Slider
