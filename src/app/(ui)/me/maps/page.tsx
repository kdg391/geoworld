'use server'

import { and, desc, eq } from 'drizzle-orm'
import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'

import MapCard from '@/components/MapCard/index.tsx'
import { db } from '@/db/index.ts'
import { mapsTable } from '@/db/schema.ts'
import { createTranslation } from '@/i18n/server.ts'
import { getCurrentSession } from '@/lib/session.ts'

const CreateButton = dynamic(() => import('./CreateButton.tsx'))

const Maps = async () => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in?next=/me/maps')

  const maps = await db
    .select()
    .from(mapsTable)
    .where(and(eq(mapsTable.creator, user.id), eq(mapsTable.type, 'community')))
    .orderBy(desc(mapsTable.updatedAt))

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
