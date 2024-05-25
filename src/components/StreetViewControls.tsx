import React from 'react'
import { FaFlag, FaRotateLeft } from 'react-icons/fa6'

import styles from './StreetViewControls.module.css'
import { useTranslation } from 'react-i18next'

interface Props {
    onReturnToStartClick: React.MouseEventHandler<HTMLButtonElement>
    onUndoClick: React.MouseEventHandler<HTMLButtonElement>
}

const StreetViewControls: React.FC<Props> = ({
    onReturnToStartClick,
    onUndoClick,
}) => {
    const { t } = useTranslation()

    return (
        <div>
            <div className={styles.returnToStartContainer}>
                <button
                    className={styles.returnToStartBtn}
                    title={t('game.controls.returnToStart')}
                    onClick={onReturnToStartClick}
                >
                    <FaFlag />
                </button>
            </div>
            <div className={styles.undoContainer}>
                <button
                    className={styles.undoBtn}
                    title={t('game.controls.undo')}
                    onClick={onUndoClick}
                >
                    <FaRotateLeft />
                </button>
            </div>
        </div>
    )
}

export default StreetViewControls
