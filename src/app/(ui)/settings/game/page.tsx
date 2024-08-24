'use server'

import dynamic from 'next/dynamic'

import styles from '../layout.module.css'

const DistanceUnitSelect = dynamic(
  () => import('@/components/DistanceUnitSelect/index.js'),
  { ssr: false },
)

const Game = () => {
  return (
    <section className={styles.section}>
      <h1 className={styles.title}>Game Settings</h1>
      <div>
        <DistanceUnitSelect />
      </div>
    </section>
  )
}

export default Game
