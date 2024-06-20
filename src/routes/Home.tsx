import { ArrowDown } from 'lucide-react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { OFFICIAL_MAPS } from '../constants/index.js'

import styles from './Home.module.css'

import type { MapData } from '../types/index.js'

const Footer = lazy(() => import('../components/Footer.js'))
const Header = lazy(() => import('../components/Header.js'))
const MapCard = lazy(() => import('../components/MapCard.js'))
const MapSettingsModal = lazy(() => import('../components/MapSettingsModal.js'))

const Home = () => {
    const { t } = useTranslation()

    const [showModal, setShowModal] = useState(false)

    const [mapData, setMapData] = useState<MapData | null>(null)

    useEffect(() => {
        if (showModal) document.body.style.setProperty('overflow-y', 'hidden')
        else document.body.style.removeProperty('overflow-y')
    }, [showModal])

    return (
        <main className={styles.main}>
            <Suspense>
                <Header />
            </Suspense>

            {showModal && (
                <Suspense>
                    <MapSettingsModal
                        mapData={mapData as MapData}
                        setShowModal={setShowModal}
                    />
                </Suspense>
            )}

            <section id="hero">
                <h1>{t('home.hero.title')}</h1>
                <p>{t('home.hero.description')}</p>
                <a href="#official-maps" role="button" aria-label="Play">
                    <ArrowDown />
                </a>
            </section>

            <section id="official-maps">
                <div className={styles.container}>
                    <h2>{t('home.officialMaps')}</h2>
                    <div className={styles.mapCards}>
                        {OFFICIAL_MAPS.map((map, index) => (
                            <Suspense key={index}>
                                <MapCard
                                    mapData={map}
                                    onPlayBtnClick={() => {
                                        setMapData(map)
                                        setShowModal(true)
                                    }}
                                />
                            </Suspense>
                        ))}
                    </div>
                </div>
            </section>

            <Suspense>
                <Footer />
            </Suspense>
        </main>
    )
}

export default Home
