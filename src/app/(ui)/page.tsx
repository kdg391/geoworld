'use server'

import Form from './Form.js'
import LeaderboardButton from './LeaderboardButton.js'

import styles from './page.module.css'

import './page.css'
import { MapPin } from 'lucide-react'

const Home = () => (
  <main>
    <section className={styles.container}>
      <div className={styles['play-container']}>
        <h1 className={styles.title}>
          <MapPin size={20} fill="red" stroke="var(--bg)" />
          스트리트 뷰를 보고 위치를 찍어 점수를 획득하세요!
        </h1>
        <Form />
      </div>
      <LeaderboardButton />
    </section>
  </main>
)

export default Home
