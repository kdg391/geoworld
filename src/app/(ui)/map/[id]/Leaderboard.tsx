'use server'

import Link from 'next/link'

import { auth } from '@/auth.js'

import { createTranslation } from '@/i18n/server.js'

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

  const { t } = await createTranslation('map')

  if (!data || error) return <p>Failed to load the leaderboard</p>

  if (data.length === 0) return <p>No data</p>

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
  )
}

export default Leaderboard
