'use server'

import dynamic from 'next/dynamic'
// import Image from 'next/image'

import { createTranslation } from '@/i18n/server.js'

import styles from './page.module.css'

import './page.css'

const Description = dynamic(() => import('./Description.js'))
const PlayButton = dynamic(() => import('./PlayButton.js'))

const Home = async () => {
  const { t } = await createTranslation('common')

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles['hero-img-container']}>
          {/*<Image
              src="/assets/images/background.jpg"
              alt="Background Image"
              className={styles['hero-img']}
              fill
              priority
            />*/}
          <div className={styles['hero-backdrop']}></div>
        </div>
        <div className={styles['hero-content']}>
          <h1>{t('hero.title')}</h1>
          <p>
            <Description />
          </p>
          <div>
            <PlayButton />
          </div>
        </div>
      </section>
      <section></section>
    </main>
  )
}

export default Home
