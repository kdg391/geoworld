'use server'

import dynamic from 'next/dynamic'

import { createTranslation } from '@/i18n/server.js'

import styles from '../layout.module.css'

const DistanceUnitSelect = dynamic(
  () => import('@/components/DistanceUnitSelect/index.js'),
)

const Game = async () => {
  const { t } = await createTranslation('settings')

  return (
    <section className={styles.section}>
      <h1 className="text-2xl mb-4">{t('game_settings')}</h1>
      <div>
        <DistanceUnitSelect />
      </div>
    </section>
  )
}

export default Game
