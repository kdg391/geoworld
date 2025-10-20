'use server'

import Form from './Form.tsx'
import LeaderboardButton from './LeaderboardButton.tsx'

import styles from './page.module.css'

import Marker from './Marker.tsx'

import './page.css'

const Home = () => (
  <main>
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>
          <Marker size={20} className={styles.marker} />
          스트리트 뷰를 보고 위치를 찍어 점수를 획득하세요!
        </h1>
        <Form />
      </div>
      <LeaderboardButton />
    </section>
  </main>
)

export default Home
