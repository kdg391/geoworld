'use server'

import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'

import { getCurrentSession } from '@/session.js'

import { createTranslation } from '@/i18n/server.js'

import { snakeCaseToCamelCase } from '@/utils/index.js'
import { createClient } from '@/utils/supabase/server.js'

import MapCard from '@/components/MapCard/index.js'

import type { APIMap, Map } from '@/types/map.js'

const CreateButton = dynamic(() => import('./CreateButton.js'))

const Maps = async () => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in?next=/dashboard/maps')

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data, error } = await supabase
    .from('maps')
    .select('*')
    .eq('creator', user.id)
    .eq('type', 'community')
    .order('updated_at', {
      ascending: false,
    })
    .returns<APIMap[]>()

  if (!data || error) return

  const maps = snakeCaseToCamelCase<Map[]>(data)

  const { t } = await createTranslation('common')

  return (
    <section>
      <h1>{t('my_maps')}</h1>
      <CreateButton />
      <div>
        {maps.length > 0 ? (
          maps.map((m) => <MapCard key={m.id} mapData={m} />)
        ) : (
          <p>No maps</p>
        )}
      </div>
    </section>
  )
}

export default Maps
