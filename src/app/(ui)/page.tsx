'use server'

import { redirect } from 'next/navigation'

import { getCurrentSession } from '@/lib/session.ts'

import Form from './Form.tsx'
import LeaderboardButton from './LeaderboardButton.tsx'
import Marker from './Marker.tsx'

import styles from './page.module.css'

import './page.css'

const Home = async () => {
  const { session } = await getCurrentSession()

  if (!session) return redirect('/sign-in')

  return (
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
}

export default Home
