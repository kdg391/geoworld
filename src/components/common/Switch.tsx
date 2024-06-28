import styles from './Switch.module.css'

interface Props {
    defaultChecked?: boolean
    id?: string
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const Switch: React.FC<Props> = ({ defaultChecked, id, onChange }) => (
    <label htmlFor={id} className={styles.switch}>
        <input
            type="checkbox"
            id={id}
            defaultChecked={defaultChecked}
            onChange={onChange}
        />
        <span></span>
    </label>
)

export default Switch
