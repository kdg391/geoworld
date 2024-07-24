import { updateSession } from './utils/supabase/middleware.js'

import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const req = await updateSession(request)
  req.headers.set('x-next-pathname', request.nextUrl.pathname)

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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
