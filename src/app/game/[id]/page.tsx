'use server'

import { notFound } from 'next/navigation'

import { getGame, startGameRound } from '@/actions/game.js'
import { getMap } from '@/actions/map.js'

import ClientPage from './page.client.js'

interface Props {
  params: Promise<{
    id: string
  }>
}

const Page = async (props: Props) => {
  const params = await props.params

  const { data: gameData, errors: gErr } = await getGame(params.id)

  if (!gameData || gErr) notFound()

  let g = gameData

  if (gameData.state !== 'finished') {
    const { data: gData, errors: gDataErr } = await startGameRound(params.id)

    if (!gData || gDataErr) notFound()

    g = gData
  }

  const { data: mapData } = await getMap(gameData.mapId)

  if (mapData === null) notFound()

  return <ClientPage gameData={g} mapData={mapData} />
}

export default Page
