import { Minus, Plus, X } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { DEFAULT_ROUNDS, FLAG_ENOJIS, MAX_ROUNDS } from '../constants/index.js'

import styles from './MapSettingsModal.module.css'

import type { MapData } from '../types/index.js'

const Button = lazy(() => import('./common/Button.js'))
const Slider = lazy(() => import('./common/Slider.js'))
const Switch = lazy(() => import('./common/Switch.js'))
const Twemoji = lazy(() => import('./Twemoji.js'))

interface Props {
    mapData: MapData
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

const MapSettingsModal: React.FC<Props> = ({ mapData, setShowModal }) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const [canMove, setCanMove] = useState(true)
    const [canPan, setCanPan] = useState(true)
    const [canZoom, setCanZoom] = useState(true)
    const [rounds, setRounds] = useState(
        mapData.locations.length > DEFAULT_ROUNDS
            ? DEFAULT_ROUNDS
            : mapData.locations.length,
    )
    const [timeLimit, setTimeLimit] = useState<number | null>(null)

    const maxRounds =
        mapData.locations.length > MAX_ROUNDS
            ? MAX_ROUNDS
            : mapData.locations.length

    return (
        <div className={styles['map-settings-modal']}>
            <div className={styles['map-settings-modal-wrapper']}>
                <div className={styles['modal-header']}>
                    <h3>{t('home.mapSettings.title')}</h3>
                    <button
                        aria-label="Close"
                        onClick={() => {
                            setShowModal(false)
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>
                <div className={styles['modal-content']}>
                    <div className={styles['map-info']}>
                        <div className={styles['map-icon']}>
                            <Suspense>
                                <Twemoji
                                    emoji={
                                        mapData.code === 'worldwide'
                                            ? '🌐'
                                            : FLAG_ENOJIS[mapData.code]
                                    }
                                    width={24}
                                    height={24}
                                    alt={
                                        mapData.code === 'worldwide'
                                            ? t('worldwide')
                                            : t(`countries.${mapData.code}`)
                                    }
                                />
                            </Suspense>
                        </div>
                        <div className={styles['map-details']}>
                            <h4>
                                {mapData.code === 'worldwide'
                                    ? t('worldwide')
                                    : t(`countries.${mapData.code}`)}
                            </h4>
                            <p>Description</p>
                        </div>
                    </div>
                    <div className={styles.setting}>
                        <label htmlFor="move">
                            {t('home.mapSettings.move')}
                        </label>
                        <Suspense>
                            <Switch
                                id="move"
                                defaultChecked={canMove}
                                onChange={(event) => {
                                    setCanMove(event.target.checked)
                                }}
                            />
                        </Suspense>
                    </div>
                    <div className={styles.setting}>
                        <label htmlFor="pan">{t('home.mapSettings.pan')}</label>
                        <Suspense>
                            <Switch
                                id="pan"
                                defaultChecked={canPan}
                                onChange={(event) => {
                                    setCanPan(event.target.checked)
                                }}
                            />
                        </Suspense>
                    </div>
                    <div className={styles.setting}>
                        <label htmlFor="zoom">
                            {t('home.mapSettings.zoom')}
                        </label>
                        <Suspense>
                            <Switch
                                id="zoom"
                                defaultChecked={canZoom}
                                onChange={(event) => {
                                    setCanZoom(event.target.checked)
                                }}
                            />
                        </Suspense>
                    </div>
                    <div className={styles.setting}>
                        <label htmlFor="rounds">
                            {t('home.mapSettings.rounds')}
                        </label>

                        <div style={{ display: 'flex' }}>
                            <button
                                className={styles['rounds-btn']}
                                disabled={rounds <= 1}
                                onClick={() => {
                                    if (rounds > 1) {
                                        setRounds((r) => r - 1)
                                    }
                                }}
                            >
                                <Minus size={16} />
                            </button>

                            <input
                                type="number"
                                id="rounds"
                                className={styles['rounds-input']}
                                min={1}
                                max={maxRounds}
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

                                    const _rounds = Math.min(
                                        parseInt(event.target.max),
                                        Math.max(
                                            parseInt(event.target.min),
                                            parseInt(value),
                                        ),
                                    )

                                    setRounds(_rounds)
                                }}
                            />

                            <button
                                className={styles['rounds-btn']}
                                disabled={rounds >= maxRounds}
                                onClick={() => {
                                    if (rounds < maxRounds) {
                                        setRounds((r) => r + 1)
                                    }
                                }}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                    <div>
                        <div>
                            <label htmlFor="time-limit">
                                {t('home.mapSettings.roundTime')}
                            </label>
                            {' ('}
                            {timeLimit === null
                                ? t('home.mapSettings.noTimeLimit')
                                : t('home.mapSettings.roundTimeFormat', {
                                      minutes: Math.floor(timeLimit / 60),
                                      seconds: timeLimit % 60,
                                  })}
                            {')'}
                        </div>
                        <div>
                            <Suspense>
                                <Slider
                                    id="time-limit"
                                    min={0}
                                    max={600}
                                    step={30}
                                    style={
                                        {
                                            '--value': `${
                                                (100 / 600) *
                                                (timeLimit === null
                                                    ? 0
                                                    : timeLimit)
                                            }%`,
                                        } as React.CSSProperties
                                    }
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
                            </Suspense>
                        </div>
                    </div>
                </div>
                <div className={styles['modal-actions']}>
                    <Suspense>
                        <Button
                            variant="secondary"
                            size="m"
                            aria-label={t('home.mapSettings.cancel')}
                            onClick={() => {
                                setShowModal(false)
                            }}
                        >
                            {t('home.mapSettings.cancel')}
                        </Button>
                        <Button
                            variant="primary"
                            size="m"
                            aria-label={t('home.play')}
                            onClick={() => {
                                navigate(`/geoworld/game/${mapData.code}`, {
                                    state: {
                                        canMove,
                                        canPan,
                                        canZoom,
                                        rounds,
                                        timeLimit,
                                    },
                                })
                            }}
                        >
                            {t('home.play')}
                        </Button>
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export default MapSettingsModal
