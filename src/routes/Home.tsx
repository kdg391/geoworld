import { ArrowDown } from 'lucide-react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { OFFICIAL_MAPS } from '../utils/constants/index.js'

import type { GameData } from '../types/index.js'

import styles from './Home.module.css'

const Footer = lazy(() => import('../components/Footer.js'))
const Header = lazy(() => import('../components/Header.js'))
const MapCard = lazy(() => import('../components/MapCard.js'))
const MapSettingsModal = lazy(() => import('../components/MapSettingsModal.js'))

const Home = () => {
    const { t } = useTranslation()

    const [showModal, setShowModal] = useState(false)

    const [gameData, setGameData] = useState<GameData | null>(null)

    useEffect(() => {
        if (showModal) document.body.style.setProperty('overflow-y', 'hidden')
        else document.body.style.removeProperty('overflow-y')
    }, [showModal])

    return (
        <main>
            <Suspense>
                <Header />
            </Suspense>

            {showModal && (
                <Suspense>
                    <MapSettingsModal
                        gameData={gameData as GameData}
                        setShowModal={setShowModal}
                    />
                </Suspense>
            )}

            <section id="hero">
                <h1>{t('home.hero')}</h1>
                <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Nam quidem, unde deleniti dolorum harum tempora laborum nisi
                    odio amet perferendis excepturi placeat quas molestiae fuga
                    consequuntur!
                </p>
                <a href="#official-maps" role="button" aria-label="Play">
                    <ArrowDown />
                </a>
            </section>

            <section id="official-maps">
                <div className={styles.container}>
                    <h2>{t('home.officialMaps')}</h2>
                    <div className={styles.wrapper}>
                        {OFFICIAL_MAPS.map((g, index) => (
                            <Suspense key={index}>
                                <MapCard
                                    gameData={g}
                                    onPlayBtnClick={() => {
                                        setGameData(g)
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
