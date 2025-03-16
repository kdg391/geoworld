'use client'

import { use, useEffect, useState } from 'react'

import { getGame } from '@/actions/game.js'
import { getMap } from '@/actions/map.js'

import type { Game } from '@/types/game.js'
import type { Map } from '@/types/map.js'

interface Props {
  params: Promise<{
    id: string
  }>
}

const Result = (props: Props) => {
  const params = use(props.params)

  const [gameData, setGameData] = useState<Game | null>()
  const [mapData, setMapData] = useState<Map | null>()

  useEffect(() => {
    const init = async () => {
      const { data: gData, errors: gErr } = await getGame(params.id)

      if (!gData || gErr) {
        setGameData(null)
        return
      }

      const { data: mData, errors: mErr } = await getMap(gData.mapId)

      if (!mData || mErr) {
        setGameData(null)
        return
      }

      setGameData(gData)
      setMapData(mData)
    }

    init()
  }, [])

  if (gameData === null) return <h1>Game Not Fonund</h1>
  if (mapData === null) return <h1>Map Not Found</h1>

  return
}

export default Result
