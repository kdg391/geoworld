import { generateState } from 'arctic'
import { cookies } from 'next/headers.js'

import { discord } from '@/lib/oauth.js'

export async function GET() {
  const state = generateState()
  const url = discord.createAuthorizationURL(state, ['email', 'identify'])

  const cookieStore = await cookies()

  cookieStore.set('discord_oauth_state', state, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  })

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  })
}
