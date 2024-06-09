import styles from './Switch.module.css'

import type React from 'react'

interface Props {
    defaultChecked?: boolean
    id?: string
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const Switch: React.FC<Props> = ({ defaultChecked, id, onChange }) => (
    <label htmlFor={id} className={styles.checkBox}>
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
