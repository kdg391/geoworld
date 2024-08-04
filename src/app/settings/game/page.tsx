'use server'

import dynamic from 'next/dynamic'

const DistanceUnitSelect = dynamic(
  () => import('../../../components/DistanceUnitSelect/index.js'),
  { ssr: false },
)

const Game = () => {
  return (
    <section>
      <h1>Game Settings</h1>
      <div>
        <DistanceUnitSelect />
      </div>
    </section>
  )
}

export default Game
