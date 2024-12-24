'use server'

import { redirect } from 'next/navigation'

import { createTranslation } from '@/i18n/server.js'

import { getCurrentSession } from '@/lib/session.js'

import { createClient } from '@/utils/supabase/server.js'

import MapCard from '@/components/MapCard/index.js'

import type { Map } from '@/types/map.js'

const Likes = async () => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in?next=/me/likes')

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data: likedMaps, error: lErr } = await supabase
    .from('likes')
    .select('map_id')
    .eq('user_id', user.id)
    .returns<{ map_id: string }[]>()

  if (!likedMaps || lErr) return

  const { data: maps, error: mErr } = await supabase
    .from('maps')
    .select('*')
    .in(
      'id',
      likedMaps.map((l) => l.map_id),
    )
    .returns<Map[]>()

  if (!maps || mErr) return

  const { t } = await createTranslation('common')

  return (
    <section>
      <h1>{t('liked_maps')}</h1>
      <div>{maps?.map((m) => <MapCard key={m.id} mapData={m} />)}</div>
    </section>
  )
}

export default Likes
