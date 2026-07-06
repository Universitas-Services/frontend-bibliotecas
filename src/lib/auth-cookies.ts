import type { NextResponse } from 'next/server'

import {
  ACCESS_TOKEN_COOKIE,
  DEFAULT_TOKEN_MAX_AGE_SECONDS,
  getCookieMaxAgeFromToken,
} from '@/lib/auth'

export const MUST_CHANGE_PASSWORD_COOKIE = 'must_change_password'
export const REFRESH_TOKEN_COOKIE = 'refresh_token'

export function isMustChangePasswordActive(cookieValue: string | undefined | null): boolean {
  return cookieValue === '1'
}

function isProductionCookie(): boolean {
  return process.env.NODE_ENV === 'production'
}

export type AccessTokenCookieOptions = {
  httpOnly: true
  secure: boolean
  sameSite: 'lax'
  path: '/'
  maxAge: number
}

export type RefreshTokenCookieOptions = {
  httpOnly: true
  secure: boolean
  sameSite: 'lax'
  path: '/'
  maxAge: number
}

export type MustChangePasswordCookieOptions = {
  httpOnly: true
  secure: boolean
  sameSite: 'lax'
  path: '/'
  maxAge: number
}

export function buildMustChangePasswordCookieOptions(): MustChangePasswordCookieOptions {
  return {
    httpOnly: true,
    secure: isProductionCookie(),
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 30,
  }
}

export function buildAccessTokenCookieOptions(
  token: string,
  maxAgeFallback = DEFAULT_TOKEN_MAX_AGE_SECONDS,
): AccessTokenCookieOptions {
  return {
    httpOnly: true,
    secure: isProductionCookie(),
    sameSite: 'lax',
    path: '/',
    maxAge: getCookieMaxAgeFromToken(token, maxAgeFallback),
  }
}

export function buildRefreshTokenCookieOptions(
  token: string,
  maxAgeFallback = DEFAULT_TOKEN_MAX_AGE_SECONDS,
): RefreshTokenCookieOptions {
  return {
    httpOnly: true,
    secure: isProductionCookie(),
    sameSite: 'lax',
    path: '/',
    maxAge: getCookieMaxAgeFromToken(token, maxAgeFallback),
  }
}

export function applySessionCookiesToResponse(
  response: NextResponse,
  options: { accessToken: string; refreshToken?: string | null; mustChangePassword: boolean },
): void {
  response.cookies.set(
    ACCESS_TOKEN_COOKIE,
    options.accessToken,
    buildAccessTokenCookieOptions(options.accessToken),
  )

  if (options.mustChangePassword) {
    response.cookies.set(MUST_CHANGE_PASSWORD_COOKIE, '1', buildMustChangePasswordCookieOptions())
    response.cookies.delete(REFRESH_TOKEN_COOKIE)
    return
  }

  response.cookies.delete(MUST_CHANGE_PASSWORD_COOKIE)

  if (options.refreshToken) {
    response.cookies.set(
      REFRESH_TOKEN_COOKIE,
      options.refreshToken,
      buildRefreshTokenCookieOptions(options.refreshToken),
    )
    return
  }

  response.cookies.delete(REFRESH_TOKEN_COOKIE)
}

export function clearSessionCookiesOnResponse(response: NextResponse): void {
  response.cookies.delete(ACCESS_TOKEN_COOKIE)
  response.cookies.delete(REFRESH_TOKEN_COOKIE)
  response.cookies.delete(MUST_CHANGE_PASSWORD_COOKIE)
}

export { ACCESS_TOKEN_COOKIE, DEFAULT_TOKEN_MAX_AGE_SECONDS, getCookieMaxAgeFromToken }
