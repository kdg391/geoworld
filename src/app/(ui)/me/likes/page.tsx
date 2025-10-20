'use server'

import { eq, inArray } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import MapCard from '@/components/MapCard/index.tsx'
import { db } from '@/db/index.ts'
import { likesTable, mapsTable } from '@/db/schema.ts'
import { createTranslation } from '@/i18n/server.ts'
import { getCurrentSession } from '@/lib/session.ts'

const Likes = async () => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in?next=/me/likes')

  const likedMaps = await db
    .select({
      mapId: likesTable.mapId,
    })
    .from(likesTable)
    .where(eq(likesTable.userId, user.id))

  const maps = await db
    .select()
    .from(mapsTable)
    .where(
      inArray(
        mapsTable.id,
        likedMaps.map((l) => l.mapId),
      ),
    )

  const { t } = await createTranslation('common')

  return (
    <section>
      <h1>{t('liked_maps')}</h1>
      <div>
        {maps.map((m) => (
          <MapCard key={m.id} mapData={m} />
        ))}
      </div>
    </section>
  )
}

export default Likes
