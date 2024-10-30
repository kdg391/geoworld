'use server'

import Form from './Form.js'
import LeaderboardButton from './LeaderboardButton.js'

import styles from './page.module.css'

import './page.css'

const Home = () => (
  <main>
    <section className={styles.container}>
      <div className={styles['play-container']}>
        <h1 className={styles.title}>학번과 이름을 입력해 주세요.</h1>
        <Form />
      </div>
      <LeaderboardButton />
    </section>
  </main>
)

export default Home
