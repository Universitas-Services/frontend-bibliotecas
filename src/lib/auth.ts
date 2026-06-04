export type UserRole = 'ADMIN' | 'CURADOR' | 'REVISOR' | 'AUDITOR'

export function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payloadBase64 = token.split('.')[1]
    if (!payloadBase64) return null
    const decodedPayload = Buffer.from(payloadBase64, 'base64').toString('utf-8')
    return JSON.parse(decodedPayload) as Record<string, unknown>
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token)
  if (!payload) return true

  const exp = payload.exp
  if (typeof exp !== 'number') return false

  return exp * 1000 <= Date.now()
}

export function getRoleFromToken(token: string): UserRole | null {
  const payload = decodeJwt(token)
  if (!payload) return null

  const role = payload.role ?? payload.roles ?? payload.Role
  if (!role) return null

  const roleName = String(role).toUpperCase()
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
