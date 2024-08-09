'use server'

import dynamic from 'next/dynamic'

import { createTranslation } from '../i18n/server.js'

import styles from './page.module.css'
import './page.css'
import { createClient } from '../utils/supabase/server.js'

const Footer = dynamic(() => import('../components/Footer/index.js'))
const Header = dynamic(() => import('../components/Header/index.js'))
const Maps = dynamic(() => import('./Maps.js'))
const PlayButton = dynamic(() => import('./PlayButton.js'))

const Home = async () => {
  const { t } = await createTranslation('translation')

  const supabase = createClient()

  const { data: uData, error } = await supabase.auth.getUser()

  return (
    <>
      <Header />

      <main>
        <section className={styles.hero}>
          <div className={styles['hero-content']}>
            <h1>Explore the World{t('')}</h1>
            <p>
              Look at the street view of locations around the world and guess
              where they are.
            </p>
            <PlayButton isSignedIn={uData.user !== null && error === null} />
          </div>
        </section>

        <section id="maps" className={styles.maps}>
          <div className={styles['maps-container']}>
            <Maps />
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default Home
