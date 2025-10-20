'use server'

import dynamic from 'next/dynamic'

import { createTranslation } from '@/i18n/server.ts'

import styles from '../layout.module.css'

const DistanceUnitSelect = dynamic(
  () => import('@/components/DistanceUnitSelect/index.tsx'),
)

const Game = async () => {
  const { t } = await createTranslation('settings')

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>{t('game_settings')}</h1>
      <div>
        <DistanceUnitSelect />
      </div>
    </section>
  )
}

export default Game
