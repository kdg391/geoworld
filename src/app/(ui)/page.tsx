'use server'

import './page.css'

import dynamic from 'next/dynamic'
// import Image from 'next/image'
import { redirect } from 'next/navigation'

import { createTranslation } from '@/i18n/server.ts'
import { getCurrentSession } from '@/lib/session.ts'

import styles from './page.module.css'

const Description = dynamic(() => import('./Description.tsx'))
const PlayButton = dynamic(() => import('./PlayButton.tsx'))

const Home = async () => {
  const { session } = await getCurrentSession()

  if (session) redirect('/dashboard')

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
