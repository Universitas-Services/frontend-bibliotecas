import { describe, expect, it } from 'vitest'

import { decodeJwt, getHomePathForRole, getRoleFromToken, isTokenExpired } from '@/lib/auth'

function createTestJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64')
  return `${header}.${body}.signature`
}

describe('auth', () => {
  it('decodes JWT payload', () => {
    const token = createTestJwt({ role: 'CURADOR', sub: 'user-1' })
    expect(decodeJwt(token)).toEqual({ role: 'CURADOR', sub: 'user-1' })
  })

  it('returns null for invalid JWT', () => {
    expect(decodeJwt('invalid')).toBeNull()
  })

  it('extracts role from token', () => {
    const token = createTestJwt({ role: 'curador' })
    expect(getRoleFromToken(token)).toBe('CURADOR')
  })

  it('supports alternate role field names', () => {
    expect(getRoleFromToken(createTestJwt({ roles: 'AUDITOR' }))).toBe('AUDITOR')
    expect(getRoleFromToken(createTestJwt({ Role: 'ADMIN' }))).toBe('ADMIN')
  })

  it('returns null for unknown roles', () => {
    expect(getRoleFromToken(createTestJwt({ role: 'CLIENTE' }))).toBeNull()
  })

  it('maps role to home path', () => {
    expect(getHomePathForRole('CURADOR')).toBe('/curador')
    expect(getHomePathForRole('AUDITOR')).toBe('/supervisor')
  })

  it('detects expired tokens via exp claim', () => {
    const expired = createTestJwt({ exp: Math.floor(Date.now() / 1000) - 10 })
    const valid = createTestJwt({ exp: Math.floor(Date.now() / 1000) + 3600 })

    expect(isTokenExpired(expired)).toBe(true)
    expect(isTokenExpired(valid)).toBe(false)
  })

  it('treats tokens without exp as not expired', () => {
    expect(isTokenExpired(createTestJwt({ role: 'CURADOR' }))).toBe(false)
  })
})
