import { Flag, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { classNames } from '../utils/index.js'

import styles from './StreetViewControls.module.css'

interface Props {
    canPan: boolean
    onReturnToStartClick: React.MouseEventHandler<HTMLButtonElement>
    onUndoClick: React.MouseEventHandler<HTMLButtonElement>
}

const StreetViewControls: React.FC<Props> = ({
    canPan,
    onReturnToStartClick,
    onUndoClick,
}) => {
    const { t } = useTranslation()

    return (
        <div
            className={classNames(
                styles['street-view-controls'],
                !canPan ? 'not-pan' : '',
            )}
        >
            <button
                className={styles['return-to-start-btn']}
                title={t('game.controls.returnToStart')}
                onClick={onReturnToStartClick}
            >
                <Flag size={16} />
            </button>
            <button
                className={styles['undo-btn']}
                title={t('game.controls.undo')}
                onClick={onUndoClick}
            >
                <RotateCcw size={16} />
            </button>
        </div>
    )
}

export default StreetViewControls
