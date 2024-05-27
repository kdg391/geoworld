import { lazy, Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { OFFICIAL_MAPS, type GameData } from '../utils/constants/index.js'

import styles from './Home.module.css'

const Footer = lazy(() => import('../components/Footer.js'))
const Header = lazy(() => import('../components/Header.js'))
const MapCard = lazy(() => import('../components/MapCard.js'))
const MapSettingsModal = lazy(() => import('../components/MapSettingsModal.js'))

const Home = () => {
    const { t } = useTranslation()

    const [showModal, setShowModal] = useState(false)

    const [gameData, setGameData] = useState<GameData | null>(null)

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
                <h1>Explore the world's street view</h1>
                <div>
                    <p>
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Nam quidem, unde deleniti dolorum harum tempora
                        laborum nisi odio amet perferendis praesentium ipsam
                        minima sint excepturi placeat quas molestiae fuga
                        consequuntur!
                    </p>
                </div>
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
