'use client'

// import { use, useEffect, useState } from 'react'

// import { getGame } from '@/actions/game.js'

// import type { Game } from '@/types/game.js'
// import type { Map } from '@/types/map.js'

// interface Props {
//   params: Promise<{
//     id: string
//   }>
// }

// const Result = (props: Props) => {
//   const params = use(props.params)

//   const [gameData, setGameData] = useState<Game | null>()
//   const [mapData, setMapData] = useState<Map | null>()

//   useEffect(() => {
//     const init = async () => {
//       const { data, errors } = await getGame(params.id)

//       if (!data || errors) {
//         setGameData(null)
//         return
//       }
//     }

//     init()
//   }, [])

//   return
// }

export default () => <div></div>
