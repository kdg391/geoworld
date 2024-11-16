import styles from './index.module.css'

const Switch = ({
  defaultChecked,
  id,
  onChange,
  ...props
}: React.ComponentProps<'input'>) => (
  <label htmlFor={id} className={styles.switch}>
    <input
      type="checkbox"
      id={id}
      defaultChecked={defaultChecked}
      onChange={onChange}
      {...props}
    />
    <span className={styles.slider}></span>
  </label>
)

export default Switch
