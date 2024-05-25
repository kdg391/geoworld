import { lazy, Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import {
    FLAG_ENOJIS,
    OFFICIAL_MAPS,
    type GameData,
} from '../utils/constants/index.js'

import styles from './Home.module.css'

const Footer = lazy(() => import('../components/Footer.js'))
const GameCard = lazy(() => import('../components/GameCard.js'))
const Header = lazy(() => import('../components/Header.js'))
const Twemoji = lazy(() => import('../components/Twemoji.js'))

const Home = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const [showModal, setShowModal] = useState(false)

    const [canMove, setCanMove] = useState(true)
    const [canPan, setCanPan] = useState(true)
    const [canZoom, setCanZoom] = useState(true)
    const [timeLimit, setTimeLimit] = useState<number | null>(null)

    const [game, setGame] = useState<GameData | null>(null)

    return (
        <main>
            <Suspense>
                <Header />
                {showModal && (
                    <div className={styles.mapSelectModal}>
                        <div className={styles.mapSelectModalWrapper}>
                            <h2 className={styles.title}>
                                {game?.code && (
                                    <>
                                        <Twemoji
                                            emoji={
                                                game.code === 'world'
                                                    ? '🌐'
                                                    : FLAG_ENOJIS[game.code]
                                            }
                                            width={32}
                                            height={32}
                                            alt={
                                                game.code === 'world'
                                                    ? t('worldMap')
                                                    : t(
                                                          `countries.${game.code}`,
                                                      )
                                            }
                                        />
                                        {game.code === 'world'
                                            ? t('worldMap')
                                            : t(`countries.${game.code}`)}
                                    </>
                                )}
                            </h2>
                            <p>
                                {t('home.locations', {
                                    locations: game?.locations.length,
                                })}
                            </p>
                            <div className={styles.setting}>
                                <label htmlFor="move">{t('home.move')}</label>
                                <div className={styles.checkBox}>
                                    <input
                                        type="checkbox"
                                        id="move"
                                        defaultChecked={canMove}
                                        onChange={(event) => {
                                            setCanMove(event.target.checked)
                                        }}
                                    />
                                    <label htmlFor="move">
                                        <span></span>
                                    </label>
                                </div>
                            </div>
                            <div className={styles.setting}>
                                <label htmlFor="pan">{t('home.pan')}</label>
                                <div className={styles.checkBox}>
                                    <input
                                        type="checkbox"
                                        id="pan"
                                        defaultChecked={canPan}
                                        onChange={(event) => {
                                            setCanPan(event.target.checked)
                                        }}
                                    />
                                    <label htmlFor="pan">
                                        <span></span>
                                    </label>
                                </div>
                            </div>
                            <div className={styles.setting}>
                                <label htmlFor="zoom">{t('home.zoom')}</label>
                                <div className={styles.checkBox}>
                                    <input
                                        type="checkbox"
                                        id="zoom"
                                        defaultChecked={canZoom}
                                        onChange={(event) => {
                                            setCanZoom(event.target.checked)
                                        }}
                                    />
                                    <label htmlFor="zoom">
                                        <span></span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="time-limit">
                                    {t('home.timeLimit')}
                                </label>
                            </div>
                            <div>
                                (
                                {timeLimit === null
                                    ? t('home.noLimit')
                                    : t('home.timeLimitFormat', {
                                          minutes: Math.floor(timeLimit / 60),
                                          seconds: timeLimit % 60,
                                      })}
                                )
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
                                    {t('home.cancel')}
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
                                    {t('home.play')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <section id="maps" className={styles.mapsSection}>
                    <div className={styles.container}>
                        <h2>{t('home.officialMaps')}</h2>
                        <div className={styles.wrapper}>
                            {OFFICIAL_MAPS.map((g, index) => (
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

                <Footer />
            </Suspense>
        </main>
    )
}

export default Home
