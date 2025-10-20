import { and, eq } from 'drizzle-orm'
import { cookies } from 'next/headers'

import { db } from '@/db/index.ts'
import { accountsTable, profilesTable, usersTable } from '@/db/schema.ts'
import { discord } from '@/lib/oauth.ts'
import {
  createSession,
  // generateSessionToken,
  setSessionTokenCookie,
} from '@/lib/session.ts'
import { generateSessionToken } from '@/lib/session-utils.ts'

import type { OAuth2Tokens } from 'arctic'

interface DiscordUser {
  id: string
  username: string
  discriminator: string
  global_name: string | null
  avatar: string | null
  bot?: boolean
  system?: boolean
  mfa_enabled?: boolean
  banner?: string | null
  accent_color?: number | null
  locale?: string
  verified?: boolean
  email?: string | null
  flags?: number
  premium_type?: number
  public_flags?: number
  avatar_decoration?: string | null
  avatar_decoration_data?: {
    asset: string
    sku_id: string
  } | null
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)

  const code = url.searchParams.get('code')
  const codeVerifier = url.searchParams.get('code_verifier')
  const state = url.searchParams.get('state')

  const storedState =
    (await cookies()).get('discord_oauth_state')?.value ?? null

  if (
    code === null ||
    codeVerifier === null ||
    state === null ||
    storedState === null
  )
    return new Response('Please restart the process.', {
      status: 400,
    })

  if (state !== storedState)
    return new Response('Please restart the process.', {
      status: 400,
    })

  let tokens: OAuth2Tokens

  try {
    tokens = await discord.validateAuthorizationCode(code, null)
  } catch {
    // Invalid code or client credentials
    return new Response('Please restart the process.', {
      status: 400,
    })
  }

  const discordAccessToken = tokens.accessToken()

  const discordRequest = new Request('https://discord.com/api/users/@me')
  discordRequest.headers.set('Authorization', `Bearer ${discordAccessToken}`)

  const discordRes = await fetch(discordRequest)
  const discordUser = (await discordRes.json()) as DiscordUser

  if (!discordUser.email || !discordUser.verified)
    return new Response(
      JSON.stringify({
        error: 'Your Discord account must have a verified email address.',
      }),
      {
        status: 400,
        headers: {
          Location: '/sign-in',
        },
      },
    )

  const existingAccResult = await db
    .select()
    .from(accountsTable)
    .where(
      and(
        eq(accountsTable.provider, 'discord'),
        eq(accountsTable.accountId, discordUser.id),
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
        Location: '/',
      },
    })
  }

  const now = new Date()

  const userResult = await db
    .insert(usersTable)
    .values({
      createdAt: now,
      email: discordUser.email,
      emailVerified: true,
      emailVerifiedAt: now,
      role: 'user',
    })
    .returning()

  const user = userResult[0]

  await db.insert(accountsTable).values({
    provider: 'discord',
    accountId: discordUser.id,
    userId: user.id,
  })

  const avatarUrl = discordUser.avatar
    ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/${
        discordUser.discriminator === '0'
          ? Number(BigInt(discordUser.id) >> 22n) % 6
          : parseInt(discordUser.discriminator) % 5
      }.png`

  await db.insert(profilesTable).values({
    id: user.id,
    avatar: {
      url: avatarUrl,
    },
    isPublic: true,
  })

  const sessionToken = generateSessionToken()
  const session = await createSession(sessionToken, user.id)

  await setSessionTokenCookie(sessionToken, session.expiresAt)

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/setup-profile',
    },
  })
}
