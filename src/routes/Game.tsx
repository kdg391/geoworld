import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Loader } from '@googlemaps/js-api-loader'

import RoundStatus from '../components/RoundStatus.js'
import StreetView from '../components/StreetView.js'

import { DEFAULT_OPTIONS, GAMES_DATA } from '../utils/constants.js'
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

    if (params?.code === undefined)
        return <Navigate to="/geography-guessing/" />

    const state = location.state as State | null

    if (state === null) return <Navigate to="/geography-guessing/" />

    const navigate = useNavigate()

    const [googleApiLoaded, setGoogleApiLoaded] = useState(false)

    const [round, setRound] = useState(0)
    const [roundFinished, setRoundFinished] = useState(false)
    const [gameFinished, setGameFinished] = useState(false)
    const [totalScore, setTotalScore] = useState(0)
    const [roundScore, setRoundScore] = useState(0)
    const [distance, setDistance] = useState(0)

    const [locations, setLocations] = useState<google.maps.LatLngLiteral[]>([])

    const guessMapElRef = useRef<HTMLDivElement | null>(null)
    const resultMapElRef = useRef<HTMLDivElement | null>(null)

    const guessMapRef = useRef<google.maps.Map | null>(null)
    const resultMapRef = useRef<google.maps.Map | null>(null)

    const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
        null,
    )
    const [markerPosition, setMarkerPosition] = useState<
        google.maps.LatLngLiteral | google.maps.LatLngAltitudeLiteral | null
    >(null)
    const resultMarker1Ref =
        useRef<google.maps.marker.AdvancedMarkerElement | null>(null)
    const resultMarker2Ref =
        useRef<google.maps.marker.AdvancedMarkerElement | null>(null)
    const pathRef = useRef<google.maps.Polyline | null>(null)

    const [timeLeft, setTimeLeft] = useState<number | null>(null)

    const data = GAMES_DATA.find((g) => g.code === params.code)!

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

        const _distance = calculateDistance(
            markerPos,
            locations[round],
            'metric',
        )

        const _roundScore = calculateRoundScore(_distance, data.scoreFactor)

        setDistance(_distance)
        setRoundScore(_roundScore)
        setTotalScore((p) => p + _roundScore)

        const bounds = new google.maps.LatLngBounds()

        bounds.extend(markerPos)
        bounds.extend(locations[round])

        resultMapRef.current?.fitBounds(bounds)
        resultMapRef.current?.setCenter(bounds.getCenter())

        markerRef.current.map = null

        if (resultMarker1Ref.current) {
            resultMarker1Ref.current.position = markerRef.current.position
        }

        if (resultMarker2Ref.current) {
            resultMarker2Ref.current.position = locations[round]
        }

        pathRef.current?.setPath([
            resultMarker1Ref.current?.position!,
            resultMarker2Ref.current?.position!,
        ])

        setRoundFinished(true)
    }

    const finishTimeUp = () => {
        if (markerPosition) {
            const _distance = calculateDistance(
                markerPosition,
                locations[round],
                'metric',
            )

            const _roundScore = calculateRoundScore(_distance, data.scoreFactor)

            setDistance(_distance)
            setRoundScore(_roundScore)
            setTotalScore((s) => s + _roundScore)

            const bounds = new google.maps.LatLngBounds()

            bounds.extend(locations[round])

            resultMapRef.current?.fitBounds(bounds)
            resultMapRef.current?.setCenter(bounds.getCenter())

            markerRef.current!.map = null

            if (resultMarker1Ref.current) {
                resultMarker1Ref.current.position = markerRef.current?.position
            }

            if (resultMarker2Ref.current) {
                resultMarker2Ref.current.position = locations[round]
            }

            pathRef.current?.setPath([
                resultMarker1Ref.current?.position!,
                resultMarker2Ref.current?.position!,
            ])
        } else {
            const bounds = new google.maps.LatLngBounds()

            bounds.extend(locations[round])

            resultMapRef.current?.fitBounds(bounds)
            resultMapRef.current?.setCenter(bounds.getCenter())

            if (resultMarker2Ref.current) {
                resultMarker2Ref.current.position = locations[round]
            }
        }

        setRoundFinished(true)
    }

    useEffect(() => {
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

            setLocations(locations.slice(0, 5))
            setTimeLeft(state.timeLimit)

            const guessMap = new google.maps.Map(
                guessMapElRef.current as HTMLDivElement,
                {
                    zoom: 6,
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

            const resultMap = new google.maps.Map(
                resultMapElRef.current as HTMLDivElement,
                {
                    disableDefaultUI: true,
                    zoomControl: true,
                    clickableIcons: false,
                    gestureHandling: 'greedy',
                    mapId: import.meta.env.VITE_GOOGLE_MAPS_2,
                },
            )

            const pinBackground = new google.maps.marker.PinElement({
                background: '#04d61d',
            })

            const resultMarker1 = new google.maps.marker.AdvancedMarkerElement({
                map: resultMap,
            })

            const resultMarker2 = new google.maps.marker.AdvancedMarkerElement({
                map: resultMap,
                content: pinBackground.element,
            })

            const path = new google.maps.Polyline({
                geodesic: true,
                strokeColor: '#000000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
            })

            path.setMap(resultMap)

            guessMapRef.current = guessMap
            resultMapRef.current = resultMap

            markerRef.current = marker
            resultMarker1Ref.current = resultMarker1
            resultMarker2Ref.current = resultMarker2

            pathRef.current = path
        }

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
        if (guessMapRef.current) {
            guessMapRef.current.setCenter(
                data.defaultOptions?.center ?? DEFAULT_OPTIONS.center!,
            )
            guessMapRef.current.setZoom(6)
        }

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
                    <div ref={resultMapElRef} className={styles.resultMap} />

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
                location={locations[round]}
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
