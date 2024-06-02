import React from 'react'
import { useTranslation } from 'react-i18next'
import { FaFlag, FaRotateLeft } from 'react-icons/fa6'

import styles from './StreetViewControls.module.css'

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
        <div className={styles.streetViewControls}>
            <button
                className={styles.returnToStartBtn}
                title={t('game.controls.returnToStart')}
                onClick={onReturnToStartClick}
            >
                <FaFlag />
            </button>
            <button
                className={styles.undoBtn}
                title={t('game.controls.undo')}
                onClick={onUndoClick}
            >
                <FaRotateLeft />
            </button>
        </div>
    )
}

export default StreetViewControls
