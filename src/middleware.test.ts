import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'

import { middleware } from '@/middleware'

function createTestJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64')
  return `${header}.${body}.signature`
}

describe('middleware', () => {
  it('redirects expired token on protected routes to login and clears cookie', () => {
    const expired = createTestJwt({
      role: 'CURADOR',
      exp: Math.floor(Date.now() / 1000) - 60,
    })
    const request = new NextRequest('http://localhost/curador/gestion-documental', {
      headers: { cookie: `access_token=${expired}` },
    })

    const response = middleware(request)

    expect(response?.status).toBe(307)
    expect(response?.headers.get('location')).toContain('/login')
    expect(response?.headers.get('location')).toContain('redirect=%2Fcurador%2Fgestion-documental')
    expect(response?.cookies.get('access_token')?.value).toBe('')
  })

  it('does not redirect valid token on protected routes', () => {
    const valid = createTestJwt({
      role: 'CURADOR',
      exp: Math.floor(Date.now() / 1000) + 3600,
    })
    const request = new NextRequest('http://localhost/curador', {
      headers: { cookie: `access_token=${valid}` },
    })

    const response = middleware(request)

    expect(response?.status).toBe(200)
  })
})
