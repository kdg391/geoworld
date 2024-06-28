import { Suspense, lazy, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import styles from './RoundResult.module.css'

const Button = lazy(() => import('./common/Button.js'))

interface Props {
    totalScore: number
}

const FinalRoundResult: React.FC<Props> = memo(({ totalScore }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <>
            <h2>
                {t('game.totalPoints', {
                    count: totalScore,
                })}
            </h2>
            <div className={styles['result-actions']}>
                <Suspense>
                    <Button
                        variant="primary"
                        onClick={() => {
                            navigate(0)
                        }}
                    >
                        {t('game.replay')}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            navigate('/geoworld/')
                        }}
                    >
                        {t('game.exit')}
                    </Button>
                </Suspense>
            </div>
        </>
    )
})

export default FinalRoundResult
