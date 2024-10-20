import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextResponse, type NextRequest } from 'next/server'
import NextAuth from 'next-auth'

import authConfig from './auth.config.js'

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './constants/i18n.js'

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    // eslint-disable-next-line
    // @ts-ignore
    SUPPORTED_LOCALES,
  )

  const locale = matchLocale(languages, SUPPORTED_LOCALES, DEFAULT_LOCALE)

  return locale
}

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
      (pathname.startsWith('/map') && pathname.endsWith('/edit')) ||
      pathname === '/setup-profile'
    ) {
      const url = new URL('/sign-in', request.url)
      url.searchParams.set('next', pathname)

      return NextResponse.redirect(url)
    }
  } else {
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
