'use server'

import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'

import { auth } from '@/auth.js'

import { createTranslation } from '@/i18n/server.js'

import { createClient } from '@/utils/supabase/server.js'

import MapCard from '@/components/MapCard/index.js'

import type { Map } from '@/types/index.js'

const CreateButton = dynamic(() => import('./CreateButton.js'))

const Maps = async () => {
  'use server'

  const session = await auth()

  if (!session) redirect('/sign-in?next=/dashboard/maps')

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data: myMaps, error: mErr } = await supabase
    .from('maps')
    .select('*')
    .eq('creator', session.user.id)
    .eq('type', 'community')
    .order('updated_at', {
      ascending: false,
    })
    .returns<Map[]>()

  if (!myMaps || mErr) return

  const { t } = await createTranslation('common')

  return (
    <section>
      <h1>{t('my_maps')}</h1>
      <CreateButton />
      <div>{myMaps?.map((m) => <MapCard key={m.id} mapData={m} />)}</div>
    </section>
  )
}

export default Maps
