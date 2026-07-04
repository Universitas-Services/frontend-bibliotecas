import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import {
  getHomePathForRole,
  getRoleFromToken,
  isTokenExpired,
  type AuthRedirectReason,
} from '@/lib/auth'
import {
  ACCESS_TOKEN_COOKIE,
  isMustChangePasswordActive,
  MUST_CHANGE_PASSWORD_COOKIE,
} from '@/lib/auth-cookies'
import { isPathAllowedForRole, isProtectedPath } from '@/lib/route-guards'

const CHANGE_PASSWORD_PATH = '/auth/change-password'
const FORGOT_PASSWORD_PATH = '/auth/forgot-password'
const RESET_PASSWORD_PATH = '/auth/reset-password'

const LOGIN_NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
}

function withLoginNoStore(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(LOGIN_NO_STORE_HEADERS)) {
    response.headers.set(key, value)
  }
  return response
}

function redirectToLogin(
  request: NextRequest,
  pathname: string,
  options: { clearToken: boolean; authReason: AuthRedirectReason },
) {
  const loginUrl = new URL('/login', request.url)
  if (pathname !== '/login') {
    loginUrl.searchParams.set('redirect', pathname)
  }
  loginUrl.searchParams.set('authReason', options.authReason)
  const response = withLoginNoStore(NextResponse.redirect(loginUrl))
  if (options.clearToken) {
    response.cookies.delete(ACCESS_TOKEN_COOKIE)
    response.cookies.delete(MUST_CHANGE_PASSWORD_COOKIE)
  }
  return response
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const rawToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  const tokenExpired = rawToken ? isTokenExpired(rawToken) : false
  const token = rawToken && !tokenExpired ? rawToken : undefined
  const role = token ? getRoleFromToken(token) : null
  const mustChangePassword = isMustChangePasswordActive(
    request.cookies.get(MUST_CHANGE_PASSWORD_COOKIE)?.value,
  )

  if (pathname === '/') {
    return withLoginNoStore(NextResponse.redirect(new URL('/login', request.url)))
  }

  if (pathname === CHANGE_PASSWORD_PATH) {
    if (!token) {
      return redirectToLogin(request, pathname, {
        clearToken: tokenExpired,
        authReason: tokenExpired ? 'expired' : 'missing',
      })
    }
    return NextResponse.next()
  }

  if (pathname === FORGOT_PASSWORD_PATH || pathname === RESET_PASSWORD_PATH) {
    return NextResponse.next()
  }

  if (pathname === '/login') {
    if (request.nextUrl.searchParams.get('logout') === '1') {
      const response = withLoginNoStore(NextResponse.next())
      response.cookies.delete(ACCESS_TOKEN_COOKIE)
      response.cookies.delete(MUST_CHANGE_PASSWORD_COOKIE)
      return response
    }

    if (token && mustChangePassword) {
      return NextResponse.redirect(new URL(CHANGE_PASSWORD_PATH, request.url))
    }

    if (token && role) {
      return NextResponse.redirect(new URL(getHomePathForRole(role), request.url))
    }

    return withLoginNoStore(NextResponse.next())
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  if (!rawToken) {
    return redirectToLogin(request, pathname, { clearToken: false, authReason: 'missing' })
  }

  if (tokenExpired) {
    return redirectToLogin(request, pathname, { clearToken: true, authReason: 'expired' })
  }

  if (!role) {
    return redirectToLogin(request, pathname, { clearToken: false, authReason: 'role' })
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
