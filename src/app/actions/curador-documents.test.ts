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

describe('getCuradorDocumentsAction', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv('API_BASE_URL', 'http://api.test')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    cookiesMock.mockReset()
  })

  it('llama solo a /documentos/curador/list y nunca a /documentos', async () => {
    const token = createTestJwt({
      role: 'CURADOR',
      sub: 'curador-1',
      exp: Math.floor(Date.now() / 1000) + 3600,
    })
    cookiesMock.mockResolvedValue({
      get: (name: string) => (name === 'access_token' ? { value: token } : undefined),
    })

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        items: [{ id: 'doc-1', titulo: 'Mi ley', estado: 'BORRADOR' }],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { getCuradorDocumentsAction } = await import('@/app/actions/curador-documents')
    const result = await getCuradorDocumentsAction({ page: 1, limit: 10 })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/documentos/curador/list?page=1&limit=10',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${token}`,
        }),
      }),
    )

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.documents).toEqual([{ id: 'doc-1', titulo: 'Mi ley', estado: 'BORRADOR' }])
      expect(result.data.total).toBe(1)
      expect(result.data.totalPages).toBe(1)
    }
  })

  it('envía filtros de estado, tiempo y búsqueda al backend', async () => {
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
      json: async () => ({
        items: [],
        total: 0,
        page: 1,
        limit: 8,
        totalPages: 0,
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { getCuradorDocumentsAction } = await import('@/app/actions/curador-documents')
    await getCuradorDocumentsAction({
      estado: 'publicados',
      tiempo: '30d',
      busqueda: 'Decreto',
      page: 1,
      limit: 8,
    })

    const calledUrl = String(fetchMock.mock.calls[0]?.[0])
    expect(calledUrl).toContain('/documentos/curador/list?')
    expect(calledUrl).toContain('estado=PUBLICADOS')
    expect(calledUrl).toContain('tiempo=30_DIAS')
    expect(calledUrl).toContain('busqueda=Decreto')
    expect(calledUrl).not.toContain('/documentos?')
    expect(calledUrl).not.toMatch(/\/documentos$/)
  })

  it('propaga errores de autenticación', async () => {
    cookiesMock.mockResolvedValue({
      get: () => undefined,
    })

    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const { getCuradorDocumentsAction } = await import('@/app/actions/curador-documents')
    const result = await getCuradorDocumentsAction()

    expect(fetchMock).not.toHaveBeenCalled()
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.code).toBe('NO_TOKEN')
    }
  })
})
