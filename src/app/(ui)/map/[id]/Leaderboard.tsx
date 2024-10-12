'use server'

import Link from 'next/link'

import { auth } from '@/auth.js'

import { createClient } from '@/utils/supabase/server.js'

interface Props {
  mapId: string
}

const Leaderboard = async ({ mapId }: Props) => {
  const session = await auth()

  const supabase = createClient({
    supabaseAccessToken: session?.supabaseAccessToken,
  })

  const { data, error } = await supabase
    .rpc('get_ranked_games', {
      p_map_id: mapId,
    })
    .select('*')

  if (!data || error) return <p>Failed to load the leaderboard</p>

  return data.length > 0 ? (
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>User</th>
          <th>Score</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {data.map((l) => (
          <tr key={l.id}>
            <td>{l.rank}</td>
            <td>
              <Link href={`/user/${l.user_id}`}>{l.display_name}</Link>
            </td>
            <td>{l.total_score}</td>
            <td>{l.total_time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No data</p>
  )
}

export default Leaderboard
