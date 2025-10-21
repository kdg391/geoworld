'use client'

import { useEffect, useState } from 'react'

import { getSchoolRankedGames } from '@/actions/game.ts'
import { classNames, formatRankTime } from '@/utils/index.ts'

import styles from './Leaderboard.module.css'

interface LeaderboardData {
  rank: number
  name: string
  total_score: number
  total_time: number
}

interface Props {
  isOpen: boolean
}

const Leaderboard = ({ isOpen }: Props) => {
  const [data, setData] = useState<LeaderboardData[] | null | undefined>(
    undefined,
  )
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    const { data, error } = await getSchoolRankedGames({
      limit: 50,
    })

    setData(data)
    setError(error)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div
      className={classNames(
        styles['leaderboard-container'],
        isOpen ? 'open' : '',
      )}
    >
      {data === undefined ? (
        <p>로딩 중...</p>
      ) : data === null || error ? (
        <p>데이터를 불러오는 데 오류가 발생했습니다.</p>
      ) : data.length === 0 ? (
        <p>랭킹 데이터 없음</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>순위</th>
              <th>이름</th>
              <th>점수</th>
              <th>시간</th>
            </tr>
          </thead>
          <tbody>
            {data.map((l, index) => (
              <tr key={index}>
                <td>{l.rank}</td>
                <td>{l.name}</td>
                <td>{l.total_score.toLocaleString()}</td>
                <td>{formatRankTime(l.total_time)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Leaderboard
