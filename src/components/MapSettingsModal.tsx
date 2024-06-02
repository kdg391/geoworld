import React, { lazy, Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaX } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'

import { DEFAULT_MAX_ROUNDS, FLAG_ENOJIS } from '../utils/constants/index.js'

import styles from './MapSettingsModal.module.css'

import type { GameData } from '../types/index.js'

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
                <div className={styles.modalHeader}>
                    <h3>Map Settings</h3>
                    <button
                        aria-label="Close"
                        onClick={() => {
                            setShowModal(false)
                        }}
                    >
                        <FaX size={16} />
                    </button>
                </div>
                <div className={styles.modalContent}>
                    <div className={styles.mapInfo}>
                        <div className={styles.mapIcon}>
                            <Suspense>
                                <Twemoji
                                    emoji={
                                        gameData.code === 'worldwide'
                                            ? '🌐'
                                            : FLAG_ENOJIS[gameData.code]
                                    }
                                    width={24}
                                    height={24}
                                    alt={
                                        gameData.code === 'worldwide'
                                            ? t('worldwide')
                                            : t(`countries.${gameData.code}`)
                                    }
                                />
                            </Suspense>
                        </div>
                        <div className={styles.mapDetails}>
                            <h4>
                                {gameData.code === 'worldwide'
                                    ? t('worldwide')
                                    : t(`countries.${gameData.code}`)}
                            </h4>
                            <p>Lorem ipsum dolor sit amet consectetur.</p>
                        </div>
                    </div>
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
                            inputMode="numeric"
                            value={rounds}
                            onKeyDown={(event) => {
                                if (event.code === 'Minus') {
                                    event.preventDefault()
                                }
                            }}
                            onChange={(event) => {
                                let value = event.target.value

                                if (isNaN(parseInt(value))) return

                                if (value !== '0' && !value.includes('.')) {
                                    value = value.replace(/^0+/, '')
                                }

                                const _rounds = Math.max(
                                    parseInt(event.target.min),
                                    Math.min(
                                        parseInt(event.target.max),
                                        parseInt(value),
                                    ),
                                )

                                setRounds(_rounds)
                            }}
                        />
                    </div>
                    <div>
                        <div>
                            <label htmlFor="time-limit">
                                {t('home.timeLimit')}
                            </label>
                            <br />(
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
                    </div>
                </div>
                <div className={styles.modalActions}>
                    <button
                        className={styles.cancelBtn}
                        aria-label={t('home.cancel')}
                        onClick={() => {
                            setShowModal(false)
                        }}
                    >
                        {t('home.cancel')}
                    </button>
                    <button
                        className={styles.playBtn}
                        aria-label={t('home.play')}
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
