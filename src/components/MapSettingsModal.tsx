import React, { lazy, Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import {
    DEFAULT_MAX_ROUNDS,
    FLAG_ENOJIS,
    type GameData,
} from '../utils/constants/index.js'

import styles from './MapSettingsModal.module.css'
import homeStyles from '../routes/Home.module.css'

const Twemoji = lazy(() => import('./Twemoji.js'))

interface Props {
    gameData: GameData
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

const MapSettingsModal: React.FC<Props> = ({ gameData, setShowModal }) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const [canMove, setCanMove] = useState(true)
    const [canPan, setCanPan] = useState(true)
    const [canZoom, setCanZoom] = useState(true)
    const [rounds, setRounds] = useState(
        gameData.locations.length > DEFAULT_MAX_ROUNDS
            ? DEFAULT_MAX_ROUNDS
            : gameData.locations.length,
    )
    const [timeLimit, setTimeLimit] = useState<number | null>(null)

    return (
        <div className={styles.mapSettingsModal}>
            <div className={styles.mapSettingsModalWrapper}>
                <h3 className={styles.title}>
                    <Suspense>
                        <Twemoji
                            emoji={
                                gameData.code === 'worldwide'
                                    ? '🌐'
                                    : FLAG_ENOJIS[gameData.code]
                            }
                            width={32}
                            height={32}
                            alt={
                                gameData.code === 'worldwide'
                                    ? t('worldwide')
                                    : t(`countries.${gameData.code}`)
                            }
                        />
                    </Suspense>
                    {gameData.code === 'worldwide'
                        ? t('worldwide')
                        : t(`countries.${gameData.code}`)}
                </h3>
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
                    <label htmlFor="rounds">{t('home.rounds')}</label>

                    <input
                        type="number"
                        id="rounds"
                        min={1}
                        max={
                            gameData.locations.length > 10
                                ? 10
                                : gameData.locations.length
                        }
                        pattern="[0-9]*"
                        value={rounds}
                        onChange={(event) => {
                            const value = Math.max(
                                parseInt(event.target.min),
                                Math.min(
                                    parseInt(event.target.max),
                                    parseInt(event.target.value),
                                ),
                            )

                            setRounds(value)
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="time-limit">{t('home.timeLimit')}</label>
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
                        className={styles.timeLimitRange}
                        min={0}
                        max={600}
                        step={30}
                        defaultValue={timeLimit === null ? 0 : timeLimit}
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
                        className={homeStyles.cancelBtn}
                        onClick={() => {
                            setShowModal(false)
                        }}
                    >
                        {t('home.cancel')}
                    </button>
                    <button
                        className={homeStyles.playBtn}
                        onClick={() => {
                            navigate(
                                `/geography-guessing/game/${gameData.code}`,
                                {
                                    state: {
                                        canMove,
                                        canPan,
                                        canZoom,
                                        rounds,
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
    )
}

export default MapSettingsModal
