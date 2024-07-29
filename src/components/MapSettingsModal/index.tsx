'use client'

import { Minus, Plus, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { createGame } from '../../actions/game.js'

import {
  DEFAULT_ROUNDS,
  FLAG_ENOJIS,
  MAX_ROUNDS,
  OFFICIAL_MAP_COUNTRY_CODES,
  OFFICIAL_MAP_WORLD_ID,
  WORLD_EMOJI,
} from '../../constants/index.js'

import { useTranslation } from '../../i18n/client.js'

import styles from './index.module.css'
import './index.css'

import type { Map } from '../../types/index.js'

const Button = dynamic(() => import('../../components/common/Button/index.js'))
const Modal = dynamic(() => import('../../components/Modal/index.js'))
const NumberInput = dynamic(
  () => import('../../components/common/NumberInput/index.js'),
)
const Slider = dynamic(() => import('../../components/common/Slider/index.js'))
const Switch = dynamic(() => import('../../components/common/Switch/index.js'))
const Twemoji = dynamic(() => import('../../components/Twemoji.js'))

interface Props {
  mapData: Map
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  showModal: boolean
  userId?: string
}

const MapSettingsModal = ({
  mapData,
  setShowModal,
  showModal,
  userId,
}: Props) => {
  const router = useRouter()
  const { t } = useTranslation('translation')

  const [canMove, setCanMove] = useState(true)
  const [canPan, setCanPan] = useState(true)
  const [canZoom, setCanZoom] = useState(true)
  const [rounds, setRounds] = useState(
    mapData.locations_count > DEFAULT_ROUNDS
      ? DEFAULT_ROUNDS
      : mapData.locations_count,
  )
  const [timeLimit, setTimeLimit] = useState<number | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  const maxRounds =
    mapData.locations_count > MAX_ROUNDS ? MAX_ROUNDS : mapData.locations_count

  return (
    <Modal isOpen={showModal}>
      <div className={styles['modal-header']}>
        <h3>{t('mapSettings.title')}</h3>
        <button aria-label="Close" onClick={() => setShowModal(false)}>
          <X size={16} />
        </button>
      </div>
      <div className={styles['modal-content']}>
        <div className={styles['map-info']}>
          <div className={styles['map-icon']}>
            {mapData.type === 'official' && (
              <Twemoji
                emoji={
                  mapData.id === OFFICIAL_MAP_WORLD_ID
                    ? WORLD_EMOJI
                    : FLAG_ENOJIS[OFFICIAL_MAP_COUNTRY_CODES[mapData.id]]
                }
                width={24}
                height={24}
                alt={
                  mapData.id === OFFICIAL_MAP_WORLD_ID
                    ? t('world')
                    : t(`country.${OFFICIAL_MAP_COUNTRY_CODES[mapData.id]}`)
                }
              />
            )}
          </div>
          <div className={styles['map-details']}>
            <h4>
              {mapData.type === 'official'
                ? mapData.id === OFFICIAL_MAP_WORLD_ID
                  ? t('world')
                  : t(`country.${OFFICIAL_MAP_COUNTRY_CODES[mapData.id]}`)
                : mapData.name}
            </h4>
            {mapData.description && <p>{mapData.description}</p>}
          </div>
        </div>
        <div className={styles.setting}>
          <label htmlFor="move">{t('mapSettings.move')}</label>
          <Switch
            id="move"
            defaultChecked={canMove}
            onChange={(event) => setCanMove(event.target.checked)}
          />
        </div>
        <div className={styles.setting}>
          <label htmlFor="pan">{t('mapSettings.pan')}</label>
          <Switch
            id="pan"
            defaultChecked={canPan}
            onChange={(event) => setCanPan(event.target.checked)}
          />
        </div>
        <div className={styles.setting}>
          <label htmlFor="zoom">{t('mapSettings.zoom')}</label>
          <Switch
            id="zoom"
            defaultChecked={canZoom}
            onChange={(event) => setCanZoom(event.target.checked)}
          />
        </div>
        <div className={styles.setting}>
          <label htmlFor="rounds">{t('mapSettings.rounds')}</label>

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

            <NumberInput
              id="rounds"
              className={styles['rounds-input']}
              min={1}
              max={maxRounds}
              step={1}
              value={rounds}
              onKeyDown={(event) => {
                if (event.code === 'Minus') {
                  event.preventDefault()
                }
              }}
              onChange={(event) => {
                let value = event.target.value

                if (value === '') {
                  setRounds(1)
                  return
                }

                if (isNaN(parseInt(value))) return

                if (value !== '0' && !value.includes('.')) {
                  value = value.replace(/^0+/, '')
                }

                const _rounds = Math.min(
                  maxRounds,
                  Math.max(1, parseInt(value)),
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
            <label htmlFor="time-limit">{t('mapSettings.roundTime')}</label>
            {' ('}
            {timeLimit === null
              ? t('mapSettings.noTimeLimit')
              : t('mapSettings.roundTimeFormat', {
                  minutes: Math.floor(timeLimit / 60),
                  seconds: timeLimit % 60,
                })}
            {')'}
          </div>
          <div>
            <Slider
              id="time-limit"
              min={0}
              max={600}
              step={30}
              style={
                {
                  '--value': `${
                    (100 / 600) * (timeLimit === null ? 0 : timeLimit)
                  }%`,
                } as React.CSSProperties
              }
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
        </div>
      </div>
      <div className={styles['modal-actions']}>
        <Button
          variant="gray"
          size="m"
          aria-label={t('cancel')}
          onClick={() => setShowModal(false)}
        >
          {t('cancel')}
        </Button>
        <Button
          variant="primary"
          size="m"
          isLoading={isLoading}
          aria-label={t('play')}
          onClick={async () => {
            if (!userId) {
              router.push('/sign-in')
              return
            }

            setIsLoading(true)

            const { data: gameData, error } = await createGame({
              mapData,
              settings: {
                canMove,
                canPan,
                canZoom,
                rounds,
                timeLimit,
              },
              userId,
            })

            if (!gameData || error) return

            setIsLoading(false)

            router.push(`/game/${gameData.id}`)
          }}
        >
          {t('play')}
        </Button>
      </div>
    </Modal>
  )
}

export default MapSettingsModal
