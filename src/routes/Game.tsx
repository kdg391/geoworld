import { lazy, Suspense, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

import COUNTRY_BOUNDS from '../constants/country-bounds.json'
import { OFFICIAL_MAPS } from '../constants/index.js'

import useGoogleApi from '../hooks/useGoogleApi.js'
import useSettings from '../hooks/useSettings.js'

import {
    calculateDistance,
    calculateRoundScore,
    calculateScoreFactor,
    shuffleArray,
} from '../utils/index.js'

import styles from './Game.module.css'

import type { CountryCodes } from '../types/index.js'

const Button = lazy(() => import('../components/common/Button.js'))
const GameStatus = lazy(() => import('../components/GameStatus.js'))
const GuessMap = lazy(() => import('../components/GuessMap.js'))
const ResultMap = lazy(() => import('../components/ResultMap.js'))
const StreetView = lazy(() => import('../components/StreetView.js'))

interface State {
    canMove: boolean
    canPan: boolean
    canZoom: boolean
    rounds: number
    timeLimit: number | null
}

const Game = () => {
    const location = useLocation()
    const params = useParams()

    const state = location.state as State | null

    if (params.code === undefined || state === null)
        return <Navigate to="/geoworld/" />

    const navigate = useNavigate()
    const { t } = useTranslation()

    const { isLoaded, loadApi } = useGoogleApi()

    const [round, setRound] = useState(0)
    const [roundFinished, setRoundFinished] = useState(false)
    const [gameFinished, setGameFinished] = useState(false)
    const [timedOut, setTimedOut] = useState(false)

    const [totalScore, setTotalScore] = useState(0)
    const [roundScore, setRoundScore] = useState(0)
    const [distance, setDistance] = useState(0)

    const [actualLocations, setActualLocations] = useState<
        google.maps.LatLngLiteral[]
    >([])
    const [guessedLocations, setGuessedLocations] = useState<
        (google.maps.LatLngLiteral | null)[]
    >([])

    const [markerPosition, setMarkerPosition] = useState<
        google.maps.LatLngLiteral | google.maps.LatLngAltitudeLiteral | null
    >(null)

    const { distanceUnit } = useSettings()

    const data = OFFICIAL_MAPS.find((m) => m.code === params.code)!

    const init = async () => {
        if (!isLoaded) await loadApi()

        const shuffled = shuffleArray(data.locations)
        const locations = shuffled.slice(0, state.rounds)

        setActualLocations(locations)
    }

    const finishRound = (timedOut: boolean) => {
        if (timedOut) {
            setTimedOut(true)
            setRoundFinished(true)
            setGuessedLocations((locs) => [...locs, null])

            return
        }

        if (markerPosition) {
            const _distance = calculateDistance(
                markerPosition,
                actualLocations[round],
                distanceUnit ?? 'metric',
            )

            const scoreFactor =
                (params.code as CountryCodes | 'worldwide') === 'worldwide'
                    ? 2000
                    : calculateScoreFactor(
                          // @ts-ignore
                          COUNTRY_BOUNDS[params.code],
                      )

            const _roundScore = calculateRoundScore(_distance, scoreFactor)

            setDistance(_distance)
            setRoundScore(_roundScore)
            setTotalScore((p) => p + _roundScore)
            setGuessedLocations((locs) => [...locs, markerPosition])

            setRoundFinished(true)
        }
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <main>
            <Suspense>
                <GameStatus
                    finishRound={finishRound}
                    mapName={
                        data.code === 'worldwide'
                            ? t('worldwide')
                            : t(`countries.${data.code}`)
                    }
                    round={round}
                    rounds={state.rounds}
                    timeLimit={state.timeLimit}
                    totalScore={totalScore}
                />
            </Suspense>

            <div
                className={styles['round-result-container']}
                style={{
                    display: roundFinished || gameFinished ? 'flex' : 'none',
                }}
            >
                <Suspense>
                    <ResultMap
                        actualLocations={actualLocations}
                        gameFinished={gameFinished}
                        guessedLocations={guessedLocations}
                        round={round}
                        roundFinished={roundFinished}
                    />
                </Suspense>

                <div className={styles['result-info']}>
                    {(gameFinished || roundFinished) &&
                        (gameFinished ? (
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
                        ) : (
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

                                            if (round === state.rounds - 1) {
                                                setGameFinished(true)
                                            } else {
                                                setRound((r) => r + 1)
                                            }
                                        }}
                                    >
                                        {round === state.rounds - 1
                                            ? t('game.viewResults')
                                            : t('game.nextRound')}
                                    </Button>
                                </Suspense>
                            </>
                        ))}
                </div>
            </div>

            <Suspense>
                <GuessMap
                    code={params.code as CountryCodes}
                    finishRound={finishRound}
                    markerPosition={markerPosition}
                    round={round}
                    setMarkerPosition={setMarkerPosition}
                />
            </Suspense>

            <Suspense>
                <StreetView
                    location={actualLocations[round]}
                    settings={{
                        canMove: state.canMove,
                        canPan: state.canPan,
                        canZoom: state.canZoom,
                    }}
                />
            </Suspense>
        </main>
    )
}

export default Game
