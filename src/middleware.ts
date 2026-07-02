import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getHomePathForRole, getRoleFromToken, isTokenExpired } from '@/lib/auth'
import { isMustChangePasswordActive, MUST_CHANGE_PASSWORD_COOKIE } from '@/lib/auth-cookies'
import { isPathAllowedForRole, isProtectedPath } from '@/lib/route-guards'

const CHANGE_PASSWORD_PATH = '/auth/change-password'
const FORGOT_PASSWORD_PATH = '/auth/forgot-password'
const RESET_PASSWORD_PATH = '/auth/reset-password'

function redirectToLogin(request: NextRequest, pathname: string, clearToken: boolean) {
  const loginUrl = new URL('/login', request.url)
  if (pathname !== '/login') {
    loginUrl.searchParams.set('redirect', pathname)
  }
  const response = NextResponse.redirect(loginUrl)
  if (clearToken) {
    response.cookies.delete('access_token')
    response.cookies.delete(MUST_CHANGE_PASSWORD_COOKIE)
  }
  return response
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const rawToken = request.cookies.get('access_token')?.value
  const tokenExpired = rawToken ? isTokenExpired(rawToken) : false
  const token = rawToken && !tokenExpired ? rawToken : undefined
  const role = token ? getRoleFromToken(token) : null
  const mustChangePassword = isMustChangePasswordActive(
    request.cookies.get(MUST_CHANGE_PASSWORD_COOKIE)?.value,
  )

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === CHANGE_PASSWORD_PATH) {
    if (!token) {
      return redirectToLogin(request, pathname, tokenExpired)
    }
    return NextResponse.next()
  }

  if (pathname === FORGOT_PASSWORD_PATH || pathname === RESET_PASSWORD_PATH) {
    return NextResponse.next()
  }

  if (pathname === '/login') {
    if (request.nextUrl.searchParams.get('logout') === '1') {
      const response = NextResponse.next()
      response.cookies.delete('access_token')
      response.cookies.delete(MUST_CHANGE_PASSWORD_COOKIE)
      return response
    }

    if (token && mustChangePassword) {
      return NextResponse.redirect(new URL(CHANGE_PASSWORD_PATH, request.url))
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

  if (mustChangePassword) {
    return NextResponse.redirect(new URL(CHANGE_PASSWORD_PATH, request.url))
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
    '/auth/:path*',
    '/curador/:path*',
    '/supervisor/:path*',
    '/admin/:path*',
    '/revisor/:path*',
  ],
}
