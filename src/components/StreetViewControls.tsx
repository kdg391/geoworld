import React from 'react'
import { FaFlag, FaRotateLeft } from 'react-icons/fa6'

import styles from './StreetViewControls.module.css'

interface Props {
    onReturnToStartClick: React.MouseEventHandler<HTMLButtonElement>
    onUndoClick: React.MouseEventHandler<HTMLButtonElement>
}

const StreetViewControls: React.FC<Props> = ({
    onReturnToStartClick,
    onUndoClick,
}) => (
    <div>
        <div className={styles.returnToStartContainer}>
            <button
                className={styles.returnToStartBtn}
                title="Return to Start"
                onClick={onReturnToStartClick}
            >
                <FaFlag />
            </button>
        </div>
        <div className={styles.undoContainer}>
            <button
                className={styles.undoBtn}
                title="Undo"
                onClick={onUndoClick}
            >
                <FaRotateLeft />
            </button>
        </div>
    </div>
)

export default StreetViewControls
