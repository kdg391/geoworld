import { and, eq } from 'drizzle-orm'

import { db } from '@/db/index.ts'
import {
  accountsTable,
  magicLinkTokensTable,
  profilesTable,
  usersTable,
} from '@/db/schema.ts'
import {
  // generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from '@/lib/session.ts'
import { generateSessionToken } from '@/lib/session-utils.ts'

export async function GET(
  _: Request,
  segmentData: {
    params: Promise<{ token: string }>
  },
): Promise<Response> {
  const params = await segmentData.params

  const magicLinkResult = await db
    .select()
    .from(magicLinkTokensTable)
    .where(eq(magicLinkTokensTable.token, params.token))

  const magicLinkData = magicLinkResult[0] ?? null

  if (!magicLinkData)
    return new Response(null, {
      status: 500,
    })

  await db
    .delete(magicLinkTokensTable)
    .where(eq(magicLinkTokensTable.id, magicLinkData.id))

  if (Date.now() >= magicLinkData.expiresAt.getTime())
    return new Response(null, {
      status: 400,
    })

  const existingUserResult = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, magicLinkData.email))

  const existingUser = existingUserResult[0] ?? null

  if (existingUser !== null) {
    const existingAccResult = await db
      .select()
      .from(accountsTable)
      .where(
        and(
          eq(accountsTable.provider, 'email'),
          eq(accountsTable.userId, existingUser.id),
        ),
      )

    const existingAccount = existingAccResult[0] ?? null

    if (existingAccount !== null) {
      const sessionToken = generateSessionToken()
      const session = await createSession(sessionToken, existingAccount.userId)

      await setSessionTokenCookie(sessionToken, session.expiresAt)

      return new Response(null, {
        status: 302,
        headers: {
          Location: '/dashboard',
          'Referrer-Policy': 'strict-origin',
        },
      })
    }
  }

  const now = new Date()

  const result = await db
    .insert(usersTable)
    .values({
      createdAt: now,
      email: magicLinkData.email,
      emailVerified: true,
      emailVerifiedAt: now,
      role: 'user',
    })
    .returning()

  const user = result[0]

  await db.insert(accountsTable).values({
    provider: 'email',
    accountId: user.id,
    userId: user.id,
  })

  await db.insert(profilesTable).values({
    id: user.id,
    isPublic: true,
  })

  const sessionToken = generateSessionToken()
  const session = await createSession(sessionToken, user.id)

  await setSessionTokenCookie(sessionToken, session.expiresAt)

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/setup-profile',
      'Referrer-Policy': 'strict-origin',
    },
  })
}
