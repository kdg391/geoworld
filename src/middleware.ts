import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextResponse, type NextRequest } from 'next/server'
import NextAuth from 'next-auth'

import authConfig from './auth.config.js'

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './constants/i18n.js'

import { createClient } from './utils/supabase/server.js'

import type { Profile } from './types/index.js'

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    // @ts-ignore
    SUPPORTED_LOCALES,
  )

  const locale = matchLocale(languages, SUPPORTED_LOCALES, DEFAULT_LOCALE)

  return locale
}

const supabase = createClient({
  serviceRole: true,
})

const { auth } = NextAuth(authConfig)

export default auth(async (request) => {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const { pathname } = request.nextUrl

  response.headers.set('x-next-pathname', pathname)
  response.headers.set('x-next-locale', getLocale(request))

  const session = request.auth

  if (!session) {
    if (
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/game') ||
      pathname === '/settings/account' ||
      pathname === '/settings/profile' ||
      (pathname.startsWith('/map') && pathname.endsWith('/edit'))
    ) {
      const url = new URL('/sign-in', request.url)
      url.searchParams.set('next', pathname)

      return NextResponse.redirect(url)
    }
  } else {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle<Profile>()

    if (profile) {
      if (!profile.display_name || !profile.username) {
        const url = new URL('/set-username', request.url)

        return NextResponse.redirect(url)
      }
    }

    if (pathname === '/') {
      const url = new URL('/dashboard', request.url)

      return NextResponse.redirect(url)
    } else if (pathname === '/sign-in' || pathname === '/sign-up') {
      const url = new URL('/dashboard', request.url)

      return NextResponse.redirect(url)
    }
  }

  return response
})

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|service-worker.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
