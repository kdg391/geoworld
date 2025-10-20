import { and, eq, lt, lte } from 'drizzle-orm'

import { db } from '@/db/index.ts'
import {
  emailVerificationCodesTable,
  gamesTable,
  magicLinkTokensTable,
  passwordResetTokensTable,
} from '@/db/schema.ts'

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

  const date1 = new Date()
  date1.setDate(date1.getDate() - 30)

  await db
    .delete(gamesTable)
    .where(
      and(eq(gamesTable.state, 'started'), lt(gamesTable.createdAt, date1)),
    )

  const date2 = new Date()

  await db
    .delete(passwordResetTokensTable)
    .where(lte(passwordResetTokensTable.expiresAt, date2))

  const date3 = new Date()

  await db
    .delete(emailVerificationCodesTable)
    .where(lte(emailVerificationCodesTable.expiresAt, date3))

  const date4 = new Date()

  await db
    .delete(magicLinkTokensTable)
    .where(lte(magicLinkTokensTable.expiresAt, date4))

  return Response.json({
    success: true,
  })
}
