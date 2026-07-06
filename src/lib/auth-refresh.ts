import { cookies } from 'next/headers'

import { getApiBaseUrl } from '@/lib/api'
import { getRoleFromToken, isTokenExpired } from '@/lib/auth'
import {
  ACCESS_TOKEN_COOKIE,
  buildAccessTokenCookieOptions,
  buildRefreshTokenCookieOptions,
  MUST_CHANGE_PASSWORD_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '@/lib/auth-cookies'

export type RefreshResult =
  | { ok: true; accessToken: string; refreshToken: string; role: string | null }
  | { ok: false; reason: 'missing_refresh' | 'refresh_failed' }

export async function refreshSessionTokens(): Promise<RefreshResult> {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value

  if (!refreshToken || isTokenExpired(refreshToken)) {
    return { ok: false, reason: 'missing_refresh' }
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    if (!res.ok) {
      return { ok: false, reason: 'refresh_failed' }
    }

    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
    const accessToken =
      typeof data.access_token === 'string'
        ? data.access_token
        : typeof data.accessToken === 'string'
          ? data.accessToken
          : ''
    const newRefreshToken =
      typeof data.refresh_token === 'string'
        ? data.refresh_token
        : typeof data.refreshToken === 'string'
          ? data.refreshToken
          : ''

    if (!accessToken || !newRefreshToken) {
      return { ok: false, reason: 'refresh_failed' }
    }

    if (isTokenExpired(accessToken) || isTokenExpired(newRefreshToken)) {
      return { ok: false, reason: 'refresh_failed' }
    }

    cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, buildAccessTokenCookieOptions(accessToken))
    cookieStore.set(
      REFRESH_TOKEN_COOKIE,
      newRefreshToken,
      buildRefreshTokenCookieOptions(newRefreshToken),
    )
    cookieStore.delete(MUST_CHANGE_PASSWORD_COOKIE)

    const role = getRoleFromToken(accessToken)
    return { ok: true, accessToken, refreshToken: newRefreshToken, role }
  } catch {
    return { ok: false, reason: 'refresh_failed' }
  }
}
