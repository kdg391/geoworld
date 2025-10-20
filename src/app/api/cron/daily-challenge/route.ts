// import { and, eq } from 'drizzle-orm'

// import { OFFICIAL_MAP_WORLD_ID } from '@/constants/index.ts'
// import { db } from '@/db/index.ts'
// import { challengesTable } from '@/db/schema.ts'

export async function GET(request: Request) {
  if (
    request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  )
    return Response.json(
      {
        message: 'Unauthorized',
      },
      {
        status: 401,
      },
    )

  return Response.json(
    {
      message: 'Work in progress',
    },
    {
      status: 500,
    },
  )

  /*const date = new Date()

  const result = await db
    .select()
    .from(challengesTable)
    .where(and(eq(challengesTable.isDailyChallenge, true), eq(challengesTable.createdAt, date)))

  const data = result[0] ?? null

  if (data !== null)
    return Response.json(
      {
        message: 'Already created',
      },
      {
        status: 500,
      },
    )

  await db.insert(result).values({
    mapId: OFFICIAL_MAP_WORLD_ID,
    userId: ADMIN_ID,
    isDailyChallenge: true,
    settings: {
      can_move: true,
      can_pan: true,
      can_zoom: true,
      rounds: 5,
      time_limit: 120,
    },
    locations: [],
  })

  return Response.json({
    success: true,
  })*/
}
