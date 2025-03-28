'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useState } from 'react'

import { updateGame } from '@/actions/game.js'

import useGoogleApi from '@/hooks/useGoogleApi.js'

import styles from './page.module.css'

import type { Game, GameView } from '@/types/game.js'
import type { Map } from '@/types/map.js'

const FinalRoundResult = dynamic(
  () => import('@/components/FinalRoundResult/index.js'),
)
const GameStatus = dynamic(() => import('@/components/GameStatus/index.js'))
const GuessMap = dynamic(() => import('@/components/GuessMap/index.js'))
const ResultMap = dynamic(() => import('@/components/ResultMap/index.js'))
const RoundResult = dynamic(() => import('@/components/RoundResult/index.js'))
const StreetView = dynamic(() => import('@/components/StreetView/index.js'))

interface Props {
  gameData: Game
  mapData: Map
}

const ClientPage = ({ gameData: g, mapData }: Props) => {
  const [gameData, setGameData] = useState<Game>(g)

  const [view, setView] = useState<GameView | null>(null)

  const [markerPosition, setMarkerPosition] =
    useState<google.maps.LatLngLiteral | null>(null)

  const { isGoogleApiLoaded, loadGoogleApi } = useGoogleApi()

  useEffect(() => {
    const init = async () => {
      if (!isGoogleApiLoaded) await loadGoogleApi()

      if (g.state === 'finished') setView('result')
      else setView('game')
    }

    init()
  }, [])

  const finishRound = useCallback(
    async (timedOut: boolean) => {
      if (!gameData) return

      if (markerPosition || timedOut) {
        const { data: updatedData, errors: uErr } = await updateGame(
          gameData.id,
          {
            guessedLocation: markerPosition,
            round: gameData.round,
            timedOut,
          },
        )

        if (!updatedData || uErr) return

        setGameData(updatedData)

        setView('result')
      }
    },
    [gameData, markerPosition],
  )

  return (
    <>
      {view === 'game' && (
        <GameStatus
          finishRound={finishRound}
          location={gameData.rounds[gameData.round]}
          mapName={mapData.name}
          round={gameData.round}
          rounds={gameData.settings.rounds}
          timeLimit={gameData.settings.timeLimit}
          totalScore={gameData.totalScore}
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
              mapId={mapData.id}
              settings={gameData.settings}
              totalScore={gameData.totalScore}
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

export default ClientPage
