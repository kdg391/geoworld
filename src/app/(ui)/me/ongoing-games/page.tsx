'use server'

import { redirect } from 'next/navigation'

import { auth } from '@/auth.js'

import { createClient } from '@/utils/supabase/server.js'
import { createTranslation } from '@/i18n/server'

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
    .select('id, created_at, map:map_id(name)')
    .match({
      user_id: session.user.id,
      state: 'started',
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
