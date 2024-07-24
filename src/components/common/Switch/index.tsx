import styles from './index.module.css'

interface Props {
  defaultChecked?: boolean
  id?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const Switch = ({ defaultChecked, id, onChange }: Props) => (
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
