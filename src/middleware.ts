import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

import { LANGUAGE_COOKIE } from './constants/i18n.ts'

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

  if (request.method === 'GET') {
    const token = request.cookies.get('session')?.value ?? null

    if (token !== null) {
      response.cookies.set('session', token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
    }

    return response
  }

  const originHeader = request.headers.get('Origin')
  const hostHeader = request.headers.get('Host')

  if (originHeader === null || hostHeader === null)
    return new NextResponse(null, {
      status: 403,
    })

  let origin: URL

  try {
    origin = new URL(originHeader)
  } catch {
    return new NextResponse(null, {
      status: 403,
    })
  }

  if (origin.host !== hostHeader)
    return new NextResponse(null, {
      status: 403,
    })

  return NextResponse.next()
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
