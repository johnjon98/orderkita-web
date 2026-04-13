import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes — no auth required
  if (pathname.startsWith('/menu') || pathname === '/login' || pathname === '/') {
    return NextResponse.next()
  }

  // For protected routes, auth is handled client-side via useAuth hook.
  // Middleware cannot read localStorage, so we pass through and let the
  // client-side layout handle redirect if token is absent.
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
