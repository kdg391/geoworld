import styles from './index.module.css'

interface Props {
  defaultChecked?: boolean
  id?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const Checkbox = ({ defaultChecked, id, onChange }: Props) => (
  <input
    type="checkbox"
    id={id}
    defaultChecked={defaultChecked}
    onChange={onChange}
    className={styles.checkbox}
  />
)

export default Checkbox
