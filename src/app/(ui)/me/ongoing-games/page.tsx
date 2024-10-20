'use server'

import { redirect } from 'next/navigation'

import { auth } from '@/auth.js'

import { createClient } from '@/utils/supabase/server.js'

// import type { Map } from '@/types/index.js'

const OngoingGames = async () => {
  'use server'

  const session = await auth()

  if (!session) redirect('/sign-in?next=/dashboard/likes')

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data: ongoingGames, error: gErr } = await supabase
    .from('games')
    .select('id, map:map_id(name, created_at)')
    .match({
      user_id: session.user.id,
      state: 'started',
    })
    .returns<{ id: string; map: { name: string; created_at: string } }[]>()

  if (!ongoingGames || gErr) return

  return (
    <section>
      <h1>Ongoing Games</h1>
      <div>
        {ongoingGames.map((g, index) => (
          <div key={index}>
            <div>{g.map.name}</div>
            <div>{g.map.created_at}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default OngoingGames
