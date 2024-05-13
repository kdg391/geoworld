import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import GameCard from '../components/GameCard.js'
import Header from '../components/Header.js'
import Twemoji from '../components/Twemoji.js'

import { GAMES_DATA, type GameData } from '../utils/constants.js'

import styles from './Home.module.css'

const Home = () => {
    const navigate = useNavigate()

    const [showModal, setShowModal] = useState<boolean>(false)

    const [canMove, setCanMove] = useState<boolean>(true)
    const [canPan, setCanPan] = useState<boolean>(true)
    const [canZoom, setCanZoom] = useState<boolean>(true)
    const [timeLimit, setTimeLimit] = useState<number | null>(null)

    const [game, setGame] = useState<GameData | null>(null)

    return (
        <main>
            <Header />
            {showModal && (
                <div className={styles.mapSelectModal}>
                    <div className={styles.mapSelectModalWrapper}>
                        {game?.emoji && <Twemoji emoji={game.emoji} />}
                        <h2>{game?.country}</h2>
                        <p>{game?.locations.length ?? 0} Locations</p>
                        <div>
                            <label htmlFor="move">Move</label>
                            <input
                                type="checkbox"
                                id="move"
                                defaultChecked={canMove}
                                onChange={(event) => {
                                    setCanMove(event.target.checked)
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="pan">Pan</label>
                            <input
                                type="checkbox"
                                id="pan"
                                defaultChecked={canPan}
                                onChange={(event) => {
                                    setCanPan(event.target.checked)
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="zoom">Zoom</label>
                            <input
                                type="checkbox"
                                id="zoom"
                                defaultChecked={canZoom}
                                onChange={(event) => {
                                    setCanZoom(event.target.checked)
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="time-limit">Time Limit</label>
                            <span>
                                {' '}
                                (
                                {timeLimit === null
                                    ? 'No Limit'
                                    : `${Math.floor(timeLimit / 60)} m ${
                                          timeLimit % 60
                                      } s`}
                                )
                            </span>
                        </div>
                        <div>
                            <input
                                type="range"
                                id="time-limit"
                                min={0}
                                max={600}
                                step={30}
                                defaultValue={
                                    timeLimit === null ? 0 : timeLimit
                                }
                                onChange={(event) => {
                                    setTimeLimit(
                                        parseInt(event.target.value) === 0
                                            ? null
                                            : parseInt(event.target.value),
                                    )
                                }}
                            />
                        </div>
                        <div className={styles.buttons}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => {
                                    setShowModal(false)
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.playBtn}
                                onClick={() => {
                                    navigate(
                                        `/geography-guessing/game/${game?.code}`,
                                        {
                                            state: {
                                                canMove,
                                                canPan,
                                                canZoom,
                                                timeLimit,
                                            },
                                        },
                                    )
                                }}
                            >
                                Play
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <section className={styles.section}>
                <div className={styles.container}>
                    <h2>Maps</h2>
                    <div className={styles.wrapper}>
                        {GAMES_DATA.map((g, index) => (
                            <GameCard
                                key={index}
                                gameData={g}
                                onPlayBtnClick={() => {
                                    setGame(g)
                                    setShowModal(true)
                                }}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <footer></footer>
        </main>
    )
}

export default Home
