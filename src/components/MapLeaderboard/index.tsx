'use server'

import Link from 'next/link'

import { getRankedGames } from '@/actions/game.ts'
import { createTranslation } from '@/i18n/server.ts'

interface Props {
  mapId: string
}

const Leaderboard = async ({ mapId }: Props) => {
  const { t } = await createTranslation('map')

  const rankedGames = await getRankedGames({
    mapId,
    count: 10,
  })

  if (rankedGames.length === 0) return <p>No data</p>

  return (
    <table>
      <thead>
        <tr>
          <th>{t('leaderboard.rank')}</th>
          <th>{t('leaderboard.user')}</th>
          <th>{t('leaderboard.score')}</th>
          <th>{t('leaderboard.time')}</th>
        </tr>
      </thead>
      <tbody>
        {rankedGames.map((g) => (
          <tr key={g.id}>
            <td>{g.rank}</td>
            <td>
              <Link href={`/user/${g.userId}`}>{g.displayName}</Link>
            </td>
            <td>{g.totalScore}</td>
            <td>{g.totalTime}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Leaderboard
