import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getHomePathForRole, getRoleFromToken, isTokenExpired } from '@/lib/auth'
import { isPathAllowedForRole, isProtectedPath } from '@/lib/route-guards'

function redirectToLogin(request: NextRequest, pathname: string, clearToken: boolean) {
  const loginUrl = new URL('/login', request.url)
  if (pathname !== '/login') {
    loginUrl.searchParams.set('redirect', pathname)
  }
  const response = NextResponse.redirect(loginUrl)
  if (clearToken) {
    response.cookies.delete('access_token')
  }
  return response
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const rawToken = request.cookies.get('access_token')?.value
  const tokenExpired = rawToken ? isTokenExpired(rawToken) : false
  const token = rawToken && !tokenExpired ? rawToken : undefined
  const role = token ? getRoleFromToken(token) : null

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

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
    return redirectToLogin(request, pathname, tokenExpired)
  }

  if (!isPathAllowedForRole(pathname, role)) {
    return NextResponse.redirect(new URL(getHomePathForRole(role), request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/curador/:path*',
    '/supervisor/:path*',
    '/admin/:path*',
    '/revisor/:path*',
  ],
}
