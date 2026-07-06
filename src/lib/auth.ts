export type UserRole = 'ADMIN' | 'CURADOR' | 'REVISOR' | 'AUDITOR'

export const ACCESS_TOKEN_COOKIE = 'access_token'
export const DEFAULT_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7
export const MIN_COOKIE_MAX_AGE_SECONDS = 60

/** Decodifica segmento JWT base64url (compatible Edge + Node). */
export function decodeBase64Url(segment: string): string {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)

  if (typeof globalThis.atob === 'function') {
    const binary = globalThis.atob(padded)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  }

  return Buffer.from(padded, 'base64').toString('utf-8')
}

export function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payloadBase64 = token.split('.')[1]
    if (!payloadBase64) return null
    const decodedPayload = decodeBase64Url(payloadBase64)
    return JSON.parse(decodedPayload) as Record<string, unknown>
  } catch {
    return null
  }
}

export function getTokenExpSeconds(token: string): number | null {
  const payload = decodeJwt(token)
  if (!payload) return null
  const exp = payload.exp
  if (typeof exp !== 'number' || !Number.isFinite(exp)) return null
  return exp
}

/** maxAge de cookie alineado al `exp` del JWT (con fallback de 7 días). */
export function getCookieMaxAgeFromToken(
  token: string,
  fallbackSeconds = DEFAULT_TOKEN_MAX_AGE_SECONDS,
): number {
  const exp = getTokenExpSeconds(token)
  if (!exp) return fallbackSeconds

  const remaining = exp - Math.floor(Date.now() / 1000)
  if (remaining <= 0) return fallbackSeconds

  return Math.max(MIN_COOKIE_MAX_AGE_SECONDS, Math.min(remaining, fallbackSeconds))
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token)
  if (!payload) return false

  const exp = payload.exp
  if (typeof exp !== 'number') return false

  return exp * 1000 <= Date.now()
}

function normalizeRoleValue(value: unknown): UserRole | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const role = normalizeRoleValue(item)
      if (role) return role
    }
    return null
  }

  if (!value) return null

  const roleName = String(value).toUpperCase()
  if (
    roleName === 'ADMIN' ||
    roleName === 'CURADOR' ||
    roleName === 'REVISOR' ||
    roleName === 'AUDITOR'
  ) {
    return roleName
  }

  return null
}

export function getRoleFromToken(token: string): UserRole | null {
  const payload = decodeJwt(token)
  if (!payload) return null

  return (
    normalizeRoleValue(payload.role) ??
    normalizeRoleValue(payload.roles) ??
    normalizeRoleValue(payload.Role)
  )
}

export function getHomePathForRole(role: UserRole): string {
  switch (role) {
    case 'ADMIN':
      return '/admin'
    case 'CURADOR':
      return '/curador'
    case 'REVISOR':
      return '/revisor'
    case 'AUDITOR':
      return '/supervisor'
  }
}

export type AuthRedirectReason = 'missing' | 'expired' | 'role' | 'profile'
