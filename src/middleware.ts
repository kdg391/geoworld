import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

import { LANGUAGE_COOKIE } from './constants/i18n.js'

export const middleware = async (request: NextRequest) => {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const { pathname } = request.nextUrl

  response.headers.set('x-next-pathname', pathname)
  response.headers.set('x-next-locale', 'ko')

  const cookieStore = await cookies()

  if (!cookieStore.has(LANGUAGE_COOKIE)) cookieStore.set(LANGUAGE_COOKIE, 'ko')

  return response
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
    '/((?!api|_next/static|_next/image|favicon.ico|service-worker.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
