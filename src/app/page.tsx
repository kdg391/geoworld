'use server'

import { ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'

import { createTranslation } from '../i18n/server.js'

import styles from './page.module.css'
import './page.css'

const Button = dynamic(() => import('../components/common/Button/index.js'))
const Footer = dynamic(() => import('../components/Footer/index.js'))
const Header = dynamic(() => import('../components/Header/index.js'))
const Maps = dynamic(() => import('./Maps.js'))

const Home = async () => {
  const { t } = await createTranslation('translation')

  return (
    <>
      <Header />

      <main>
        <section className={styles.hero}>
          <div className={styles['hero-content']}>
            <h1>Explore the World</h1>
            <p>
              Look at the street view of locations around the world and guess
              where they are.
            </p>
            <Button variant="primary" size="m">
              {t('play')}
              <ArrowRight size={16} />
            </Button>
          </div>
        </section>

        <section id="maps" className={styles.maps}>
          <div className={styles.container}>
            <Maps />
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default Home
