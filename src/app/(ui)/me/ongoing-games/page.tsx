'use server'

import { and, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db/index.ts'
import { gamesTable, locationsTable, mapsTable } from '@/db/schema.ts'
import { createTranslation } from '@/i18n/server.ts'
import { getCurrentSession } from '@/lib/session.ts'

const OngoingGames = async () => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in?next=/me/ongoing-games')

  const ongoingGames = await db
    .select({
      id: gamesTable.id,
      createdAt: gamesTable.createdAt,
      map: {
        name: mapsTable.name,
      },
    })
    .from(gamesTable)
    .leftJoin(mapsTable, eq(locationsTable.mapId, mapsTable.id))
    .where(and(eq(gamesTable.state, 'started'), eq(gamesTable.userId, user.id)))

  const { t } = await createTranslation('common')

  return (
    <section>
      <h1>{t('ongoing_games')}</h1>
      <div>
        {ongoingGames.map((g, index) => (
          <div key={index}>
            <div>{g.map?.name}</div>
            <div>{g.createdAt.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default OngoingGames
