'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server.js'

import type { Map } from '@/types/index.js'

import MapCard from '@/components/MapCard/index.js'

const Likes = async () => {
  'use server'

  const supabase = createClient()

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser()

  if (!user || uErr) redirect('/sign-in?next=/dashboard/maps')

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

  return (
    <section>
      <h1>Liked Maps</h1>
      <div>{maps?.map((m) => <MapCard key={m.id} mapData={m} />)}</div>
    </section>
  )
}

export default Likes
