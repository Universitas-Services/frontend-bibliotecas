import {
  ACCESS_TOKEN_COOKIE,
  DEFAULT_TOKEN_MAX_AGE_SECONDS,
  getCookieMaxAgeFromToken,
} from '@/lib/auth'

export const MUST_CHANGE_PASSWORD_COOKIE = 'must_change_password'

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

export { ACCESS_TOKEN_COOKIE, DEFAULT_TOKEN_MAX_AGE_SECONDS, getCookieMaxAgeFromToken }
