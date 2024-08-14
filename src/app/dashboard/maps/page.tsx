'use server'

import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server.js'

import type { Map } from '@/types/index.js'

import MapCard from '@/components/MapCard/index.js'

const CreateButton = dynamic(() => import('./CreateButton.js'))

const Maps = async () => {
  'use server'

  const supabase = createClient()

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser()

  if (!user || uErr) redirect('/sign-in?next=/dashboard/maps')

  const { data: myMaps, error: mErr } = await supabase
    .from('maps')
    .select('*')
    .eq('creator', user.id)
    .eq('type', 'community')
    .order('updated_at', {
      ascending: false,
    })
    .returns<Map[]>()

  if (!myMaps || mErr) return

  return (
    <section>
      <h1>My Maps</h1>
      <CreateButton />
      <div>{myMaps?.map((m) => <MapCard key={m.id} mapData={m} />)}</div>
    </section>
  )
}

export default Maps
