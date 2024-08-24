'use server'

import dynamic from 'next/dynamic'
import Image from 'next/image'

import { createTranslation } from '@/i18n/server.js'

import styles from './page.module.css'
import './page.css'

const PlayButton = dynamic(() => import('./PlayButton.js'))

const Home = async () => {
  const { t } = await createTranslation('translation')

  return (
    <>
      <main>
        <section className={styles.hero}>
          <div className={styles['hero-image']}>
            <Image
              src="/assets/images/background.jpg"
              alt="Background Image"
              className={styles['bg-image']}
              fill
              priority
            />
            <div className={styles['hero-backdrop']}></div>
          </div>
          <div className={styles['hero-content']}>
            <h1>{t('heroTitle')}</h1>
            <p>
              Test your geography skills and discover new places.
              <br />
              Ready to guess the world?
            </p>
            <div>
              <PlayButton />
            </div>
          </div>
        </section>
        <section></section>
      </main>
    </>
  )
}

export default Home
