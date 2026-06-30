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

describe('getDocumentsAction', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv('API_BASE_URL', 'http://api.test')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    cookiesMock.mockReset()
  })

  it('returns auth error when there is no token', async () => {
    cookiesMock.mockResolvedValue({
      get: () => undefined,
    })

    const { getDocumentsAction } = await import('@/app/actions/documents')
    const result = await getDocumentsAction()

    expect(result).toEqual({
      success: false,
      error: 'No tiene autorización para realizar esta acción.',
      status: 401,
      code: 'NO_TOKEN',
    })
  })

  it('returns auth error when token is expired', async () => {
    const expired = createTestJwt({ role: 'CURADOR', exp: Math.floor(Date.now() / 1000) - 60 })
    cookiesMock.mockResolvedValue({
      get: (name: string) => (name === 'access_token' ? { value: expired } : undefined),
    })

    const { getDocumentsAction } = await import('@/app/actions/documents')
    const result = await getDocumentsAction()

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.code).toBe('TOKEN_EXPIRED')
      expect(result.status).toBe(401)
    }
  })

  it('returns documents on successful API response', async () => {
    const token = createTestJwt({
      role: 'CURADOR',
      exp: Math.floor(Date.now() / 1000) + 3600,
    })
    cookiesMock.mockResolvedValue({
      get: (name: string) => (name === 'access_token' ? { value: token } : undefined),
    })

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [{ id: 'doc-1', titulo: 'Ley 123', estado: 'BORRADOR' }],
    })
    vi.stubGlobal('fetch', fetchMock)

    const { getDocumentsAction } = await import('@/app/actions/documents')
    const result = await getDocumentsAction()

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/documentos',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${token}`,
        }),
      }),
    )
    expect(result).toEqual({
      success: true,
      status: 200,
      data: [{ id: 'doc-1', titulo: 'Ley 123', estado: 'BORRADOR' }],
    })
  })

  it('returns error when upload has no file', async () => {
    const token = createTestJwt({
      role: 'CURADOR',
      exp: Math.floor(Date.now() / 1000) + 3600,
    })
    cookiesMock.mockResolvedValue({
      get: (name: string) => (name === 'access_token' ? { value: token } : undefined),
    })

    const { uploadDocumentAction } = await import('@/app/actions/documents')
    const formData = new FormData()
    formData.append('titulo', 'Sin archivo')

    const result = await uploadDocumentAction(formData)

    expect(result.error).toContain('archivo')
  })

  it('propagates 401 from backend with message', async () => {
    const token = createTestJwt({
      role: 'CURADOR',
      exp: Math.floor(Date.now() / 1000) + 3600,
    })
    cookiesMock.mockResolvedValue({
      get: (name: string) => (name === 'access_token' ? { value: token } : undefined),
    })

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: 'JWT expired' }),
      }),
    )

    const { getDocumentsAction } = await import('@/app/actions/documents')
    const result = await getDocumentsAction()

    expect(result).toEqual({
      success: false,
      error: 'Su sesión expiró. Inicie sesión nuevamente.',
      status: 401,
      code: 'TOKEN_EXPIRED',
    })
  })
})
