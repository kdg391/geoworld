import { Loader } from '@googlemaps/js-api-loader'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

import useSettings from '../hooks/useSettings.js'

import type { CountryCodes } from '../utils/constants/countryBounds.js'
import { OFFICIAL_MAPS } from '../utils/constants/index.js'
import {
    calculateDistance,
    calculateRoundScore,
    shuffleArray,
} from '../utils/index.js'

import styles from './Game.module.css'

const GuessMap = lazy(() => import('../components/GuessMap.js'))
const ResultMap = lazy(() => import('../components/ResultMap.js'))
const RoundStatus = lazy(() => import('../components/RoundStatus.js'))
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
        return <Navigate to="/geography-guessing/" />

    const navigate = useNavigate()
    const { t } = useTranslation()

    const [googleApiLoaded, setGoogleApiLoaded] = useState(false)

    const [round, setRound] = useState(0)
    const [roundFinished, setRoundFinished] = useState(false)
    const [gameFinished, setGameFinished] = useState(false)

    const [totalScore, setTotalScore] = useState(0)
    const [roundScore, setRoundScore] = useState(0)
    const [distance, setDistance] = useState(0)

    const [actualLocations, setActualLocations] = useState<
        google.maps.LatLngLiteral[]
    >([])
    const [guessedLocations, setGuessedLocations] = useState<
        google.maps.LatLngLiteral[]
    >([])

    const [markerPosition, setMarkerPosition] = useState<
        google.maps.LatLngLiteral | google.maps.LatLngAltitudeLiteral | null
    >(null)

    const settingsContext = useSettings()

    const data = OFFICIAL_MAPS.find((g) => g.code === params.code)!

    const init = async () => {
        const loader = new Loader({
            apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
            version: 'weekly',
        })

        await loader.importLibrary('core')
        await loader.importLibrary('maps')
        await loader.importLibrary('marker')
        await loader.importLibrary('streetView')

        setGoogleApiLoaded(true)

        const shuffled = shuffleArray(data.locations)
        const locations = shuffled.slice(0, state.rounds)

        setActualLocations(locations)

        if (import.meta.env.DEV) {
            console.log(locations)
        }
    }

    const finishRound = () => {
        if (markerPosition) {
            const _distance = calculateDistance(
                markerPosition,
                actualLocations[round],
                settingsContext?.distanceUnit ?? 'metric',
            )

            const _roundScore = calculateRoundScore(_distance, data.scoreFactor)

            setDistance(_distance)
            setRoundScore(_roundScore)
            setTotalScore((p) => p + _roundScore)
            setGuessedLocations((locs) => [...locs, markerPosition])

            setRoundFinished(true)
        }
    }

    const finishTimeOut = () => {
        if (markerPosition) {
            const _distance = calculateDistance(
                markerPosition,
                actualLocations[round],
                settingsContext?.distanceUnit ?? 'metric',
            )

            const _roundScore = calculateRoundScore(_distance, data.scoreFactor)

            setDistance(_distance)
            setRoundScore(_roundScore)
            setTotalScore((s) => s + _roundScore)
            setGuessedLocations((locs) => [...locs, markerPosition])
        }

        setRoundFinished(true)
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <main>
            <Suspense>
                <RoundStatus
                    finishTimeOut={finishTimeOut}
                    mapName={
                        data.code === 'world'
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
                className={styles.roundResultContainer}
                style={{
                    display: roundFinished || gameFinished ? 'flex' : 'none',
                }}
            >
                <div className={styles.roundResultWrapper}>
                    <Suspense>
                        <ResultMap
                            googleApiLoaded={googleApiLoaded}
                            actualLocations={actualLocations}
                            guessedLocations={guessedLocations}
                            gameFinished={gameFinished}
                            round={round}
                            roundFinished={roundFinished}
                            className={styles.resultMap}
                        />
                    </Suspense>

                    <div className={styles.resultInfo}>
                        {gameFinished ? (
                            <>
                                <h2>
                                    {t('game.totalPoints', {
                                        totalScore: totalScore.toLocaleString(),
                                    })}
                                </h2>
                                <div>
                                    <button
                                        className={styles.replayBtn}
                                        onClick={() => {
                                            navigate(0)
                                        }}
                                    >
                                        {t('game.replay')}
                                    </button>
                                    <button
                                        className={styles.exitBtn}
                                        onClick={() => {
                                            navigate('/geography-guessing/')
                                        }}
                                    >
                                        {t('game.exit')}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2>
                                    {t('game.roundPoints', {
                                        roundScore: roundScore.toLocaleString(),
                                    })}
                                </h2>
                                <p>
                                    <Trans
                                        i18nKey={`game.roundResult.${settingsContext?.distanceUnit}`}
                                        values={{
                                            distance,
                                        }}
                                    />
                                </p>
                                {round === state.rounds - 1 ? (
                                    <button
                                        className={styles.nextBtn}
                                        onClick={() => {
                                            setRoundFinished(false)
                                            setGameFinished(true)
                                        }}
                                    >
                                        {t('game.viewResults')}
                                    </button>
                                ) : (
                                    <button
                                        className={styles.nextBtn}
                                        onClick={() => {
                                            setRound((r) => r + 1)

                                            setRoundFinished(false)
                                        }}
                                    >
                                        {t('game.nextRound')}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.guessMapContainer}>
                <Suspense>
                    <GuessMap
                        googleApiLoaded={googleApiLoaded}
                        code={params.code as CountryCodes}
                        data={data}
                        markerPosition={markerPosition}
                        setMarkerPosition={setMarkerPosition}
                        round={round}
                        className={styles.guessMap}
                    />
                </Suspense>

                <button
                    className={styles.guessBtn}
                    disabled={markerPosition === null}
                    onClick={() => {
                        finishRound()
                    }}
                >
                    Guess
                </button>
            </div>

            <Suspense>
                <StreetView
                    googleApiLoaded={googleApiLoaded}
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
