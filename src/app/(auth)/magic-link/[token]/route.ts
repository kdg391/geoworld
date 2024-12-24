import {
  // generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from '@/lib/session.js'
import { generateSessionToken } from '@/lib/session-utils.js'

import { createClient } from '@/utils/supabase/server.js'

import type { APIMagicLinkToken } from '@/lib/magic-link.js'
import type { APIAccount } from '@/types/account.js'
import type { APIProfile } from '@/types/profile.js'
import type { APIUser } from '@/types/user.js'

export async function GET(
  _: Request,
  segmentData: {
    params: Promise<{ token: string }>
  },
): Promise<Response> {
  const params = await segmentData.params

  const supabase = createClient({
    serviceRole: true,
  })

  const { data: magicLinkData, error: mErr } = await supabase
    .from('magic_link_tokens')
    .select('*')
    .eq('token', params.token)
    .maybeSingle<APIMagicLinkToken>()

  if (mErr)
    return new Response(null, {
      status: 500,
    })

  if (!magicLinkData)
    return new Response(null, {
      status: 500,
    })

  await supabase.from('magic_link_tokens').delete().eq('id', magicLinkData.id)

  if (Date.now() >= new Date(magicLinkData.expires_at).getTime())
    return new Response(null, {
      status: 400,
    })

  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('email', magicLinkData.email)
    .maybeSingle<APIUser>()

  if (existingUser !== null) {
    const { data: existingAccount } = await supabase
      .from('accounts')
      .select('*')
      .match({
        provider: 'email',
        user_id: existingUser.id,
      })
      .maybeSingle<APIAccount>()

    if (existingAccount !== null) {
      const sessionToken = generateSessionToken()
      const session = await createSession(sessionToken, existingAccount.user_id)

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

  const now = new Date().toISOString()

  const { data: user, error: userErr } = await supabase
    .from('users')
    .insert<Partial<APIUser>>({
      created_at: now,
      email: magicLinkData.email,
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
      provider: 'email',
      account_id: user.id,
      user_id: user.id,
    })

  if (accountErr)
    return new Response(null, {
      status: 500,
    })

  const { error: profileErr } = await supabase
    .from('profiles')
    .insert<Partial<APIProfile>>({
      id: user.id,
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
      'Referrer-Policy': 'strict-origin',
    },
  })
}
