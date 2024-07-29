'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import { getGame, updateGame } from '../../../actions/game.js'
import { getMap } from '../../../actions/map.js'

import {
  OFFICIAL_MAP_COUNTRY_CODES,
  OFFICIAL_MAP_WORLD_ID,
} from '../../../constants/index.js'

import useGoogleApi from '../../../hooks/useGoogleApi.js'

import { useTranslation } from '../../../i18n/client.js'

import styles from './page.module.css'

import type { Game, GameView, Map } from '../../../types/index.js'

const FinalRoundResult = dynamic(
  () => import('../../../components/FinalRoundResult/index.js'),
)
const GameStatus = dynamic(
  () => import('../../../components/GameStatus/index.js'),
)
const GuessMap = dynamic(() => import('../../../components/GuessMap/index.js'))
const ResultMap = dynamic(
  () => import('../../../components/ResultMap/index.js'),
)
const RoundResult = dynamic(
  () => import('../../../components/RoundResult/index.js'),
)
const StreetView = dynamic(
  () => import('../../../components/StreetView/index.js'),
)

interface Props {
  params: {
    id: string
  }
}

const Game = ({ params }: Props) => {
  const { t } = useTranslation('translation')

  const [mapData, setMapData] = useState<Map | null>()
  const [gameData, setGameData] = useState<Game | null>()

  const [view, setView] = useState<GameView | null>(null)

  const [markerPosition, setMarkerPosition] =
    useState<google.maps.LatLngLiteral | null>(null)

  const { isLoaded, loadApi } = useGoogleApi()

  useEffect(() => {
    const loadGame = async () => {
      const { data: gData, error: gDataErr } = await getGame(params.id)

      if (!gData) {
        setGameData(null)
        return
      }
      if (gDataErr) return

      const { data: mData, error: mDataErr } = await getMap(gData.map_id)

      if (!mData) {
        setMapData(null)
        return
      }
      if (mDataErr) return

      if (!isLoaded) await loadApi()

      setGameData(gData)
      setMapData(mData)

      if (gData.state === 'finished') setView('result')
      else setView('game')
    }

    loadGame()
  }, [])

  const finishRound = useCallback(
    async (timedOut: boolean) => {
      if (!mapData || !gameData) return

      if (markerPosition || timedOut) {
        const { data: updatedData, error: uErr } = await updateGame(
          gameData.id,
          {
            guessedLocation: markerPosition,
            mapData,
            timedOut,
          },
        )

        if (!updatedData || uErr) return

        setGameData(updatedData)

        setView('result')
      }
    },
    [mapData, gameData, markerPosition],
  )

  if (mapData === null)
    return (
      <section>
        <h1>Map Not Found</h1>
        <Link href="/">Go to Home</Link>
      </section>
    )

  if (gameData === null)
    return (
      <section>
        <h1>Game Not Found</h1>
        <Link href="/">Go to Home</Link>
      </section>
    )

  if (!mapData || !gameData)
    return (
      <section>
        <h1>Loading...</h1>
      </section>
    )

  return (
    <>
      {view === 'game' && (
        <GameStatus
          finishRound={finishRound}
          mapName={
            mapData.type === 'official'
              ? mapData.id === OFFICIAL_MAP_WORLD_ID
                ? t('world')
                : t(`country.${OFFICIAL_MAP_COUNTRY_CODES[mapData.id]}`)
              : mapData.name
          }
          round={gameData.round}
          rounds={gameData.settings.rounds}
          timeLimit={gameData.settings.timeLimit}
          totalScore={gameData.guessed_rounds.reduce((a, b) => a + b.points, 0)}
        />
      )}

      <div
        className={styles['result-container']}
        style={{
          display:
            view === 'result' || view === 'finalResult' ? 'flex' : 'none',
        }}
      >
        <ResultMap
          actualLocations={gameData.actual_locations}
          guessedLocations={gameData.guessed_locations}
          round={gameData.round}
          rounds={gameData.settings.rounds}
          view={view}
        />

        <div className={styles['result-wrapper']}>
          {view === 'result' && (
            <RoundResult
              finished={gameData.state === 'finished'}
              gameId={gameData.id}
              guessedRound={
                gameData.guessed_rounds[gameData.guessed_rounds.length - 1]
              }
              round={gameData.round}
              rounds={gameData.settings.rounds}
              setGameData={setGameData}
              setView={setView}
            />
          )}

          {view === 'finalResult' && (
            <FinalRoundResult
              mapData={mapData}
              settings={gameData.settings}
              totalScore={gameData.guessed_rounds.reduce(
                (a, b) => a + b.points,
                0,
              )}
              userId={gameData.user_id}
            />
          )}
        </div>
      </div>

      <GuessMap
        finishRound={finishRound}
        mapData={mapData}
        markerPosition={markerPosition}
        round={gameData.round}
        setMarkerPosition={setMarkerPosition}
        view={view}
      />

      <StreetView
        location={gameData.actual_locations[gameData.round]}
        settings={{
          canMove: gameData.settings.canMove,
          canPan: gameData.settings.canPan,
          canZoom: gameData.settings.canZoom,
        }}
        view={view}
      />
    </>
  )
}

export default Game
