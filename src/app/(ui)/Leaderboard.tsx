'use client'

import { useEffect, useState } from 'react'

import { getSchoolRankedGames } from '@/actions/game.ts'
import { OFFICIAL_MAP_WORLD_ID } from '@/constants/index.ts'
import { classNames, formatRankTime } from '@/utils/index.ts'

import styles from './Leaderboard.module.css'

import MapSelect from './MapSelect'
import DateSelect from './DateSelect'

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
  const [isLoading, setIsLoading] = useState(false)

  const [mapId, setMapId] = useState(OFFICIAL_MAP_WORLD_ID)
  const [date, setDate] = useState('2025-10-31')

  const loadData = async ({ mapId, date }: { mapId: string; date: string }) => {
    setIsLoading(true)

    const { data, error } = await getSchoolRankedGames({
      limit: 100,
      mapId,
      date,
    })

    setIsLoading(false)

    setData(data)
    setError(error)
  }

  useEffect(() => {
    loadData({ mapId, date })
  }, [mapId, date])

  return (
    <div
      className={classNames(
        styles['leaderboard-container'],
        isOpen ? 'open' : '',
        isLoading ||
          data === undefined ||
          data === null ||
          data.length === 0 ||
          error !== null
          ? 'no-data'
          : '',
      )}
    >
      <div className="flex gap-2.5 items-center justify-start px-2 pt-1">
        <DateSelect date={date} setDate={setDate} />
        <MapSelect selectedMap={mapId} setSelectedMap={setMapId} />
      </div>
      {isLoading || data === undefined ? (
        <div className={styles.c}>
          <p>로딩 중...</p>
        </div>
      ) : error !== null ? (
        <div className={styles.c}>
          <p>데이터를 불러오는 데 오류가 발생했습니다.</p>
        </div>
      ) : data === null || data.length === 0 ? (
        <div className={styles.c}>
          <p>랭킹 데이터 없음</p>
        </div>
      ) : (
        <div>
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
                  <td>{formatRankTime(Math.floor(l.total_time))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Leaderboard
