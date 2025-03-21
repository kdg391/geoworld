'use client'

import { Minus, Plus } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { createGame } from '@/actions/game.js'

import { DEFAULT_ROUNDS, MAX_ROUNDS } from '@/constants/game.js'
import {
  FLAG_ENOJIS,
  OFFICIAL_MAP_COUNTRY_CODES,
  OFFICIAL_MAP_WORLD_ID,
  WORLD_EMOJI,
} from '@/constants/index.js'

import { useTranslation } from '@/i18n/client.js'

import Modal from '../common/Modal/index.js'

import styles from './index.module.css'

import type { Map } from '@/types/map.js'

const Button = dynamic(() => import('../common/Button/index.js'))
const NumberInput = dynamic(() => import('../common/NumberInput/index.js'))
const Slider = dynamic(() => import('../common/Slider/index.js'))
const Switch = dynamic(() => import('../common/Switch/index.js'))
const Twemoji = dynamic(() => import('../Twemoji.js'))

interface Props {
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  mapData: Map
  userId?: string
}

const GameSettingsModal = ({
  isModalOpen,
  setIsModalOpen,
  mapData,
  userId,
}: Props) => {
  const router = useRouter()

  const [canMove, setCanMove] = useState(true)
  const [canPan, setCanPan] = useState(true)
  const [canZoom, setCanZoom] = useState(true)
  const [rounds, setRounds] = useState(
    mapData.locationsCount > DEFAULT_ROUNDS
      ? DEFAULT_ROUNDS
      : mapData.locationsCount,
  )
  const [timeLimit, setTimeLimit] = useState<number>(0)

  const [isLoading, setIsLoading] = useState(false)

  const { t } = useTranslation(['common', 'game-settings'])

  const maxRounds =
    mapData.locationsCount > MAX_ROUNDS ? MAX_ROUNDS : mapData.locationsCount

  const onPlayClick = async () => {
    if (!userId) {
      router.push('/sign-in')
      return
    }

    setIsLoading(true)

    const { data: gameData, errors } = await createGame({
      mapId: mapData.id,
      settings: {
        canMove,
        canPan,
        canZoom,
        rounds,
        timeLimit,
      },
    })

    if (!gameData || errors) {
      setIsLoading(false)
      return
    }

    router.push(`/game/${gameData.id}`)
  }

  return (
    <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
      <Modal.Header>
        <Modal.Title>
          {t('title', {
            ns: 'game-settings',
          })}
        </Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Content>
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
                alt={mapData.name}
              />
            )}
          </div>
          <div className={styles['map-details']}>
            <h4>{mapData.name}</h4>
            {mapData.description && <p>{mapData.description}</p>}
          </div>
        </div>
        <div className={styles.setting}>
          <label htmlFor="move">
            {t('move', {
              ns: 'game-settings',
            })}
          </label>
          <Switch
            id="move"
            defaultChecked={canMove}
            onChange={(event) => setCanMove(event.target.checked)}
          />
        </div>
        <div className={styles.setting}>
          <label htmlFor="pan">
            {t('pan', {
              ns: 'game-settings',
            })}
          </label>
          <Switch
            id="pan"
            defaultChecked={canPan}
            onChange={(event) => setCanPan(event.target.checked)}
          />
        </div>
        <div className={styles.setting}>
          <label htmlFor="zoom">
            {t('zoom', {
              ns: 'game-settings',
            })}
          </label>
          <Switch
            id="zoom"
            defaultChecked={canZoom}
            onChange={(event) => setCanZoom(event.target.checked)}
          />
        </div>
        <div className={styles.setting}>
          <label htmlFor="rounds">
            {t('rounds', {
              ns: 'game-settings',
            })}
          </label>

          <div className="flex">
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
            <label htmlFor="time-limit">
              {t('round_time', {
                ns: 'game-settings',
              })}
            </label>
            {' ('}
            {timeLimit === 0
              ? t('no_time_limit', {
                  ns: 'game-settings',
                })
              : t('round_time_format', {
                  ns: 'game-settings',
                  minutes: Math.floor(timeLimit / 60),
                  seconds: timeLimit % 60,
                  style: 'unit',
                  formatParams: {
                    minutes: {
                      unit: 'minute',
                    },
                    seconds: {
                      unit: 'second',
                    },
                  },
                })}
            {')'}
          </div>
          <div>
            <Slider
              id="time-limit"
              min={0}
              max={600}
              step={10}
              style={
                {
                  '--value': `${(100 / 600) * timeLimit}%`,
                } as React.CSSProperties
              }
              defaultValue={timeLimit}
              onChange={(event) => {
                setTimeLimit(parseInt(event.target.value))
              }}
            />
          </div>
        </div>
      </Modal.Content>
      <Modal.Footer>
        <Modal.Actions>
          <Button variant="gray" size="m" onClick={() => setIsModalOpen(false)}>
            {t('cancel')}
          </Button>
          <Button
            variant="primary"
            size="m"
            isLoading={isLoading}
            disabled={isLoading}
            onClick={onPlayClick}
          >
            {t('play')}
          </Button>
        </Modal.Actions>
      </Modal.Footer>
    </Modal>
  )
}

export default GameSettingsModal
