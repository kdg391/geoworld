'use server'

import dynamic from 'next/dynamic'
// import Image from 'next/image'
import Link from 'next/link'

import { getCommunityMaps, getOfficialMaps } from '../actions/map.js'

import styles from './page.module.css'
import './page.css'
import { createClient } from '../utils/supabase/server.js'

const Footer = dynamic(() => import('../components/Footer/index.js'))
const Header = dynamic(() => import('../components/Header/index.js'))
const MapCard = dynamic(() => import('../components/MapCard/index.js'))

const Home = async () => {
  const supabase = createClient()

  const { data: uData, error: uErr } = await supabase.auth.getUser()

  const { data: communityMaps, error: communityMapsErr } =
    await getCommunityMaps()
  const { data: officialMaps, error: officialMapsErr } = await getOfficialMaps()

  return (
    <>
      <Header />

      <main>
        <section className={styles.hero}>
          {/* <Image
            src="/assets/background.avif"
            alt="Background Image"
            className={styles['bg-image']}
            fill
            priority
          /> */}
          <div className={styles['hero-content']}>
            <h1>Explore the World</h1>
            <p>
              Look at the street view of locations around the world and guess
              where they are.
            </p>
            {!uData || uErr ? (
              <button>Getting Started</button>
            ) : (
              <button>Play</button>
            )}
          </div>
        </section>

        <section id="official-maps" className={styles['official-maps']}>
          <div className={styles.container}>
            <div>
              <h2>Community Maps</h2>
              <div className={styles['map-cards']}>
                {!communityMaps || communityMapsErr
                  ? "Can't load the community maps"
                  : communityMaps.map((map) => (
                      <MapCard key={map.id} mapData={map} />
                    ))}
              </div>
              <Link href="/maps">Show more</Link>
            </div>
            <div>
              <h2>Official Maps</h2>
              <div className={styles['map-cards']}>
                {!officialMaps || officialMapsErr
                  ? "Can't load the official maps"
                  : officialMaps.map((map) => (
                      <MapCard key={map.id} mapData={map} />
                    ))}
              </div>
              <Link href="/maps">Show more</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default Home
