import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DEFAULT_API_BASE_URL } from '@/lib/api'

function createTestJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  const body = Buffer.from(JSON.stringify(payload))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  return `${header}.${body}.signature`
}

describe('authenticateLogin', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('returns redirect path and token on successful login', async () => {
    const accessToken = createTestJwt({
      role: 'CURADOR',
      exp: Math.floor(Date.now() / 1000) + 3600,
    })
    const refreshToken = createTestJwt({
      role: 'CURADOR',
      exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 7,
    })

    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          access_token: accessToken,
          refresh_token: refreshToken,
          mustChangePassword: false,
        }),
      ),
    )

    const { authenticateLogin } = await import('@/lib/auth-login')
    const result = await authenticateLogin({
      email: 'curador@test.com',
      password: 'secret',
      redirect: '/curador/gestion-documental',
    })

    expect(result).toEqual({
      ok: true,
      accessToken,
      refreshToken,
      mustChangePassword: false,
      redirectTo: '/curador/gestion-documental',
    })
    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${DEFAULT_API_BASE_URL}/auth/login`,
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('redirects to change-password when mustChangePassword is true', async () => {
    const accessToken = createTestJwt({
      role: 'ADMIN',
      exp: Math.floor(Date.now() / 1000) + 1800,
    })

    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          access_token: accessToken,
          mustChangePassword: true,
        }),
      ),
    )

    const { authenticateLogin } = await import('@/lib/auth-login')
    const result = await authenticateLogin({
      email: 'admin@test.com',
      password: 'secret',
    })

    expect(result).toEqual({
      ok: true,
      accessToken,
      refreshToken: null,
      mustChangePassword: true,
      redirectTo: '/auth/change-password',
    })
  })

  it('rejects expired tokens from backend', async () => {
    const token = createTestJwt({
      role: 'CURADOR',
      exp: Math.floor(Date.now() / 1000) - 60,
    })

    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          access_token: token,
        }),
      ),
    )

    const { authenticateLogin } = await import('@/lib/auth-login')
    const result = await authenticateLogin({
      email: 'curador@test.com',
      password: 'secret',
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toContain('token inválido')
    }
  })

  it('returns backend error message on failed login', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ message: 'Credenciales inválidas' }, { status: 401 })),
    )

    const { authenticateLogin } = await import('@/lib/auth-login')
    const result = await authenticateLogin({
      email: 'curador@test.com',
      password: 'wrong',
    })

    expect(result.ok).toBe(false)
  })
})
