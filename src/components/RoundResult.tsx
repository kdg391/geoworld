import { Suspense, lazy, memo } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import useSettings from '../hooks/useSettings.js'

import styles from './RoundResult.module.css'

const Button = lazy(() => import('./common/Button.js'))

interface Props {
    distance: number
    round: number
    roundScore: number
    rounds: number
    setGameFinished: React.Dispatch<React.SetStateAction<boolean>>
    setRound: React.Dispatch<React.SetStateAction<number>>
    setRoundFinished: React.Dispatch<React.SetStateAction<boolean>>
    setTimedOut: React.Dispatch<React.SetStateAction<boolean>>
    timedOut: boolean
}

const RoundResult: React.FC<Props> = memo(
    ({
        distance,
        round,
        roundScore,
        rounds,
        setGameFinished,
        setRound,
        setRoundFinished,
        setTimedOut,
        timedOut,
    }) => {
        const { t } = useTranslation()

        const { distanceUnit } = useSettings()

        return (
            <>
                <h2>
                    {t('game.roundPoints', {
                        count: timedOut ? 0 : roundScore,
                    })}
                </h2>
                <p>
                    {timedOut ? (
                        "You've timed out."
                    ) : (
                        <Trans
                            i18nKey={`game.roundResult.${distanceUnit}`}
                            values={{
                                distance,
                            }}
                        />
                    )}
                </p>
                <Suspense>
                    <Button
                        variant="primary"
                        className={styles['next-btn']}
                        onClick={() => {
                            setRoundFinished(false)

                            if (timedOut) setTimedOut(false)

                            if (round === rounds - 1) {
                                setGameFinished(true)
                            } else {
                                setRound((r) => r + 1)
                            }
                        }}
                    >
                        {round === rounds - 1
                            ? t('game.viewResults')
                            : t('game.nextRound')}
                    </Button>
                </Suspense>
            </>
        )
    },
)

export default RoundResult
