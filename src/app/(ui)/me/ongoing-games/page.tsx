'use server'

import { redirect } from 'next/navigation'

import { getCurrentSession } from '@/session.js'

import { createTranslation } from '@/i18n/server.js'

import { createClient } from '@/utils/supabase/server.js'

// import type { Map } from '@/types/index.js'

const OngoingGames = async () => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in?next=/dashboard/likes')

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data: ongoingGames, error: gErr } = await supabase
    .from('games')
    .select('id, created_at, map:map_id(name)')
    .match({
      state: 'started',
      user_id: user.id,
    })
    .returns<{ id: string; created_at: string; map: { name: string } }[]>()

  if (!ongoingGames || gErr) return

  const { t } = await createTranslation('common')

  return (
    <section>
      <h1>{t('ongoing_games')}</h1>
      <div>
        {ongoingGames.map((g, index) => (
          <div key={index}>
            <div>{g.map.name}</div>
            <div>{new Date(g.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default OngoingGames
