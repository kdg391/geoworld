import { Loader } from '@googlemaps/js-api-loader'
import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

import ResultMap from '../components/ResultMap.js'
import RoundStatus from '../components/RoundStatus.js'
import StreetView from '../components/StreetView.js'

import COUNTRY_BOUNDS from '../utils/constants/countryBounds.js'
import { DEFAULT_OPTIONS, GAMES_DATA } from '../utils/constants/index.js'
import { calculateDistance, calculateRoundScore } from '../utils/index.js'

import styles from './Game.module.css'

interface State {
    canMove: boolean
    canPan: boolean
    canZoom: boolean
    timeLimit: number | null
}

const MAX_ROUNDS = 5

const Game = () => {
    const location = useLocation()
    const params = useParams()

    const state = location.state as State | null

    if (params.code === undefined || state === null)
        return <Navigate to="/geography-guessing/" />

    const navigate = useNavigate()

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

    const guessMapElRef = useRef<HTMLDivElement | null>(null)
    const guessMapRef = useRef<google.maps.Map | null>(null)

    const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
        null,
    )
    const [markerPosition, setMarkerPosition] = useState<
        google.maps.LatLngLiteral | google.maps.LatLngAltitudeLiteral | null
    >(null)

    const [timeLeft, setTimeLeft] = useState<number | null>(null)

    const data = GAMES_DATA.find((g) => g.code === params.code)!

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

        let locations = [...data.locations]

        for (let i = locations.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[locations[i], locations[j]] = [locations[j], locations[i]]
        }

        setActualLocations(locations.slice(0, 5))
        setTimeLeft(state.timeLimit)

        const guessMap = new google.maps.Map(
            guessMapElRef.current as HTMLDivElement,
            {
                disableDefaultUI: true,
                zoomControl: true,
                clickableIcons: false,
                fullscreenControl: true,
                draggableCursor: 'crosshair',
                mapId: import.meta.env.VITE_GOOGLE_MAPS_1,
                ...DEFAULT_OPTIONS,
                ...data.defaultOptions,
            },
        )

        const marker = new google.maps.marker.AdvancedMarkerElement({
            map: guessMap,
        })

        guessMapRef.current = guessMap

        markerRef.current = marker

        fitGuessMapBounds()
    }

    const fitGuessMapBounds = () => {
        if (!guessMapRef.current) return

        if (params.code !== undefined && params.code in COUNTRY_BOUNDS) {
            const [lng1, lat1, lng2, lat2] = COUNTRY_BOUNDS[
                params.code as 'kr' | 'us'
            ] as number[]

            const bounds = new google.maps.LatLngBounds()

            bounds.extend(new google.maps.LatLng(lat1, lng1))
            bounds.extend(new google.maps.LatLng(lat2, lng2))

            guessMapRef.current.fitBounds(bounds)
            guessMapRef.current.setCenter(bounds.getCenter())
        } else {
            guessMapRef.current.setCenter(
                DEFAULT_OPTIONS.center as google.maps.LatLngLiteral,
            )
            guessMapRef.current.setZoom(2)
        }
    }

    const finishRound = () => {
        if (!markerRef.current) return

        let markerPos = markerRef.current.position ?? null

        if (markerPos === null) return

        if (
            markerPos instanceof google.maps.LatLng ||
            markerPos instanceof google.maps.LatLngAltitude
        ) {
            markerPos = markerPos.toJSON()
        }

        setMarkerPosition(markerPos)
        setGuessedLocations((locs) => [...locs, markerPos])

        const _distance = calculateDistance(
            markerPos,
            actualLocations[round],
            'metric',
        )

        const _roundScore = calculateRoundScore(_distance, data.scoreFactor)

        setDistance(_distance)
        setRoundScore(_roundScore)
        setTotalScore((p) => p + _roundScore)

        markerRef.current.map = null

        setRoundFinished(true)
    }

    const finishTimeUp = () => {
        if (markerPosition) {
            const _distance = calculateDistance(
                markerPosition,
                actualLocations[round],
                'metric',
            )

            const _roundScore = calculateRoundScore(_distance, data.scoreFactor)

            setDistance(_distance)
            setRoundScore(_roundScore)
            setTotalScore((s) => s + _roundScore)

            markerRef.current!.map = null
        }

        setRoundFinished(true)
    }

    useEffect(() => {
        init()
    }, [])

    useEffect(() => {
        if (!guessMapRef.current) return

        const clickEvent = guessMapRef.current.addListener(
            'click',
            (event: google.maps.MapMouseEvent) => {
                setMarkerPosition(event.latLng?.toJSON() ?? null)

                if (markerRef.current !== null) {
                    if (markerRef.current.map === null)
                        markerRef.current.map = guessMapRef.current

                    markerRef.current.position = event.latLng
                }
            },
        )

        return () => {
            clickEvent.remove()
        }
    }, [guessMapRef.current])

    useEffect(() => {
        fitGuessMapBounds()

        if (markerRef.current) {
            markerRef.current.map = null
            markerRef.current.position = null

            setMarkerPosition(null)
        }

        if (state.timeLimit !== null) {
            setTimeLeft(state.timeLimit)
        }
    }, [round])

    useEffect(() => {
        if (timeLeft === null) return

        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev as number) - 1)
        }, 1000)

        if (timeLeft <= 0) {
            clearInterval(interval)

            finishTimeUp()
        }

        return () => {
            clearInterval(interval)
        }
    }, [timeLeft])

    return (
        <main>
            <RoundStatus
                mapName={data.country}
                round={round}
                timeLeft={timeLeft}
                timeLimit={state.timeLimit}
                totalScore={totalScore}
            />

            <div
                className={styles.roundResultContainer}
                style={{
                    display: roundFinished || gameFinished ? 'flex' : 'none',
                }}
            >
                <div className={styles.roundResultWrapper}>
                    <ResultMap
                        googleApiLoaded={googleApiLoaded}
                        actualLocations={actualLocations}
                        guessedLocations={guessedLocations}
                        gameFinished={gameFinished}
                        round={round}
                        roundFinished={roundFinished}
                        className={styles.resultMap}
                    />

                    <div className={styles.resultInfo}>
                        {gameFinished ? (
                            <>
                                <h2>Total {totalScore} Points</h2>
                                <div>
                                    <button
                                        className={styles.replayBtn}
                                        onClick={() => {
                                            navigate(0)
                                        }}
                                    >
                                        Replay
                                    </button>
                                    <button
                                        className={styles.exitBtn}
                                        onClick={() => {
                                            navigate('/geography-guessing/')
                                        }}
                                    >
                                        Exit
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2>+{roundScore} Points</h2>
                                <p>
                                    Your guess was {distance.toFixed(1)} km from
                                    the correct location
                                </p>
                                {round === MAX_ROUNDS - 1 ? (
                                    <button
                                        className={styles.nextBtn}
                                        onClick={() => {
                                            setRoundFinished(false)
                                            setGameFinished(true)
                                        }}
                                    >
                                        View Results
                                    </button>
                                ) : (
                                    <button
                                        className={styles.nextBtn}
                                        onClick={() => {
                                            setRound((r) => r + 1)

                                            setRoundFinished(false)
                                        }}
                                    >
                                        Next Round
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.guessMapContainer}>
                <div ref={guessMapElRef} className={styles.guessMap} />

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

            <StreetView
                googleApiLoaded={googleApiLoaded}
                location={actualLocations[round]}
                settings={{
                    canMove: state.canMove,
                    canPan: state.canPan,
                    canZoom: state.canZoom,
                }}
            />
        </main>
    )
}

export default Game
