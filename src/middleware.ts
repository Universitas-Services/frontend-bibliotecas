import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getHomePathForRole, getRoleFromToken } from '@/lib/auth'
import { isPathAllowedForRole, isProtectedPath } from '@/lib/route-guards'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('access_token')?.value
  const role = token ? getRoleFromToken(token) : null

  if (pathname === '/login') {
    if (request.nextUrl.searchParams.get('logout') === '1') {
      const response = NextResponse.next()
      response.cookies.delete('access_token')
      return response
    }

    if (token && role) {
      return NextResponse.redirect(new URL(getHomePathForRole(role), request.url))
    }
    return NextResponse.next()
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  if (!token || !role) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (!isPathAllowedForRole(pathname, role)) {
    return NextResponse.redirect(new URL(getHomePathForRole(role), request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/curador/:path*', '/supervisor/:path*', '/admin/:path*', '/revisor/:path*'],
}
