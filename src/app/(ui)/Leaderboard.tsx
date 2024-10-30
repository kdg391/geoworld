'use client'

import { useEffect, useState } from 'react'

import { getSchoolRankedGames } from '@/actions/game.js'

import { formatRankTime } from '@/utils/index.js'

import styles from './Leaderboard.module.css'

interface LeaderboardData {
  rank: number
  name: string
  total_score: number
  total_time: number
}

const Leaderboard = () => {
  const [data, setData] = useState<LeaderboardData[] | null | undefined>(
    undefined,
  )
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    const { data, error } = await getSchoolRankedGames()

    setData(data)
    setError(error)
  }

  useEffect(() => {
    loadData()
  }, [])

  if (data === undefined) return <p>로딩 중...</p>
  if (data === null || error)
    return <p>데이터를 불러오는 데 오류가 발생했습니다.</p>
  if (data.length === 0) return <p>데이터 없음</p>

  return (
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
  )
}

export default Leaderboard
