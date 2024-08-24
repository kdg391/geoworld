'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import { getGame, updateGame } from '@/actions/game.js'
import { getMap } from '@/actions/map.js'

import useGoogleApi from '@/hooks/useGoogleApi.js'

import styles from './page.module.css'

import type { Game, GameView, Map } from '@/types/index.js'

import Loading from './Loading.js'

const FinalRoundResult = dynamic(
  () => import('@/components/FinalRoundResult/index.js'),
)
const GameStatus = dynamic(() => import('@/components/GameStatus/index.js'))
const GuessMap = dynamic(() => import('@/components/GuessMap/index.js'))
const ResultMap = dynamic(() => import('@/components/ResultMap/index.js'))
const RoundResult = dynamic(() => import('@/components/RoundResult/index.js'))
const StreetView = dynamic(() => import('@/components/StreetView/index.js'))

interface Props {
  params: {
    id: string
  }
}

const Game = ({ params }: Props) => {
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

      if (
        gData.state !== 'finished' &&
        gData.rounds.length === gData.guesses.length
      ) {
        const { data, error } = await updateGame(gData.id, {
          data: null,
          type: 'roundStart',
        })

        if (!data || error) return

        setGameData(data)
      } else {
        setGameData(gData)
      }

      setMapData(mData)

      if (gData.state === 'finished') setView('result')
      else setView('game')
    }

    loadGame()
  }, [])

  const finishRound = useCallback(
    async (timedOut: boolean) => {
      if (!gameData) return

      if (markerPosition || timedOut) {
        const { data: updatedData, error: uErr } = await updateGame(
          gameData.id,
          {
            data: {
              guessedLocation: markerPosition,
              timedOut,
            },
            type: 'guess',
          },
        )

        if (!updatedData || uErr) return

        setGameData(updatedData)

        setView('result')
      }
    },
    [gameData, markerPosition],
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

  if (!mapData || !gameData) return <Loading />

  return (
    <>
      {view === 'game' && (
        <GameStatus
          finishRound={finishRound}
          mapName={mapData.name}
          round={gameData.round}
          rounds={gameData.settings.rounds}
          timeLimit={gameData.settings.timeLimit}
          totalScore={gameData.total_score}
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
          actualLocations={gameData.rounds}
          guessedLocations={gameData.guesses}
          round={gameData.round}
          view={view}
        />

        <div className={styles['result-wrapper']}>
          {view === 'result' && (
            <RoundResult
              gameId={gameData.id}
              guessedRound={gameData.guesses[gameData.guesses.length - 1]}
              isFinished={
                gameData.state === 'finished' ||
                gameData.round === gameData.settings.rounds - 1
              }
              setGameData={setGameData}
              setView={setView}
            />
          )}

          {view === 'finalResult' && (
            <FinalRoundResult
              mapData={mapData}
              settings={gameData.settings}
              totalScore={gameData.total_score}
              userId={gameData.user_id}
            />
          )}
        </div>
      </div>

      <GuessMap
        finishRound={finishRound}
        mapData={mapData}
        markerPosition={markerPosition}
        setMarkerPosition={setMarkerPosition}
        round={gameData.round}
        view={view}
      />

      <StreetView
        location={gameData.rounds[gameData.round]}
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
