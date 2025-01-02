import { cookies } from 'next/headers.js'

import { discord } from '@/lib/oauth.js'
import {
  createSession,
  // generateSessionToken,
  setSessionTokenCookie,
} from '@/lib/session.js'
import { generateSessionToken } from '@/lib/session-utils.js'

import { createClient } from '@/utils/supabase/server.js'

import type { OAuth2Tokens } from 'arctic'
import type { APIAccount } from '@/types/account.js'
import type { APIProfile } from '@/types/profile.js'
import type { APIUser } from '@/types/user.js'

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
  const state = url.searchParams.get('state')
  const storedState =
    (await cookies()).get('discord_oauth_state')?.value ?? null

  if (code === null || state === null || storedState === null)
    return new Response('Please restart the process.', {
      status: 400,
    })

  if (state !== storedState)
    return new Response('Please restart the process.', {
      status: 400,
    })

  let tokens: OAuth2Tokens

  try {
    tokens = await discord.validateAuthorizationCode(code)
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

  const supabase = createClient({
    serviceRole: true,
  })

  const { data: existingAccount } = await supabase
    .from('accounts')
    .select('*')
    .match({
      provider: 'discord',
      account_id: discordUser.id,
    })
    .maybeSingle<APIAccount>()

  if (existingAccount !== null) {
    const sessionToken = generateSessionToken()
    const session = await createSession(sessionToken, existingAccount.user_id)

    await setSessionTokenCookie(sessionToken, session.expiresAt)

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    })
  }

  const now = new Date().toISOString()

  const { data: user, error: userErr } = await supabase
    .from('users')
    .insert<Partial<APIUser>>({
      created_at: now,
      email: discordUser.email,
      email_verified: true,
      email_verified_at: now,
      role: 'user',
    })
    .select()
    .single<APIUser>()

  if (userErr)
    return new Response(null, {
      status: 500,
    })

  const { error: accountErr } = await supabase
    .from('accounts')
    .insert<Partial<APIAccount>>({
      provider: 'discord',
      account_id: discordUser.id,
      user_id: user.id,
    })

  if (accountErr)
    return new Response(null, {
      status: 500,
    })

  const avatarUrl = discordUser.avatar
    ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/${
        discordUser.discriminator === '0'
          ? Number(BigInt(discordUser.id) >> 22n) % 6
          : parseInt(discordUser.discriminator) % 5
      }.png`

  const { error: profileErr } = await supabase
    .from('profiles')
    .insert<Partial<APIProfile>>({
      id: user.id,
      avatar: {
        url: avatarUrl,
      },
      is_public: true,
    })

  if (profileErr)
    return new Response(null, {
      status: 500,
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
