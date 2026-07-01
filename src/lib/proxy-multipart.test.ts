import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const cookiesMock = vi.fn()

vi.mock('next/headers', () => ({
  cookies: () => cookiesMock(),
}))

function createTestJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64')
  return `${header}.${body}.signature`
}

describe('proxyMultipartToBackend', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv('API_BASE_URL', 'http://api.test')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    cookiesMock.mockReset()
  })

  it('reenvía el stream del request con duplex half y Content-Type original', async () => {
    const token = createTestJwt({
      role: 'CURADOR',
      exp: Math.floor(Date.now() / 1000) + 3600,
    })
    cookiesMock.mockResolvedValue({
      get: (name: string) => (name === 'access_token' ? { value: token } : undefined),
    })

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: 'doc-1' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const boundary = '----WebKitFormBoundaryTest'
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('--multipart-body--'))
        controller.close()
      },
    })

    const request = new Request('http://localhost/api/documentos/upload', {
      method: 'POST',
      headers: { 'content-type': `multipart/form-data; boundary=${boundary}` },
      body,
      duplex: 'half',
    } as RequestInit)

    const { proxyMultipartToBackend } = await import('@/lib/api-client')
    const result = await proxyMultipartToBackend(request, '/documentos/upload', 'POST')

    expect(result.success).toBe(true)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/documentos/upload',
      expect.objectContaining({
        method: 'POST',
        duplex: 'half',
        headers: expect.objectContaining({
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
        }),
      }),
    )

    const init = fetchMock.mock.calls[0][1] as RequestInit & { duplex?: string }
    expect(init.body).toBe(body)
    expect(init.headers).not.toHaveProperty('Content-Length')
  })
})
