import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const authenticateLoginMock = vi.fn()

vi.mock('@/lib/auth-login', () => ({
  authenticateLogin: authenticateLoginMock,
}))

function createTestJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64')
  return `${header}.${body}.signature`
}

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('sets access_token cookie and redirects on success', async () => {
    const accessToken = createTestJwt({
      role: 'CURADOR',
      exp: Math.floor(Date.now() / 1000) + 3600,
    })
    const refreshToken = createTestJwt({
      role: 'CURADOR',
      exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 7,
    })

    authenticateLoginMock.mockResolvedValue({
      ok: true,
      accessToken,
      refreshToken,
      mustChangePassword: false,
      redirectTo: '/curador/gestion-documental',
    })

    const { POST } = await import('@/app/api/auth/login/route')
    const formData = new FormData()
    formData.set('email', 'curador@test.com')
    formData.set('password', 'secret')
    formData.set('redirect', '/curador/gestion-documental')

    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: formData,
    })

    const response = await POST(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost/curador/gestion-documental')
    expect(response.cookies.get('access_token')?.value).toBe(accessToken)
    expect(response.cookies.get('refresh_token')?.value).toBe(refreshToken)
  })

  it('redirects back to login with error on failure', async () => {
    authenticateLoginMock.mockResolvedValue({
      ok: false,
      error: 'Credenciales inválidas',
    })

    const { POST } = await import('@/app/api/auth/login/route')
    const formData = new FormData()
    formData.set('email', 'curador@test.com')
    formData.set('password', 'wrong')

    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: formData,
    })

    const response = await POST(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/login')
    expect(response.headers.get('location')).toContain('loginError=')
  })
})
