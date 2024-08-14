import { NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server.js'

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const { origin, searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)

    return NextResponse.redirect(`${origin}${next}`)
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(origin)
}
