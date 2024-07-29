import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './constants/i18n.js'

import { updateSession } from './utils/supabase/middleware.js'

import type { NextRequest } from 'next/server'

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

export async function middleware(request: NextRequest) {
  const req = await updateSession(request)

  req.headers.set('x-next-pathname', request.nextUrl.pathname)
  req.headers.set('x-next-locale', getLocale(request))

  return req
}

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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
