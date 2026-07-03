import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const apiGetMock = vi.fn()

vi.mock('@/lib/api-client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api-client')>()
  return {
    ...actual,
    apiGet: (...args: unknown[]) => apiGetMock(...args),
  }
})

describe('getAdminDocumentsAction', () => {
  beforeEach(() => {
    vi.resetModules()
    apiGetMock.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('consulta paginación server-side sin slice local', async () => {
    apiGetMock.mockResolvedValueOnce({
      success: true,
      status: 200,
      data: {
        items: [
          {
            id: 'doc-1',
            titulo: 'Ley en revisión',
            estado: 'PENDIENTE_REVISION',
            curador: { nombre: 'Ana', apellido: 'López', email: 'ana@test.com' },
            _count: { notasInternas: 1 },
          },
        ],
        total: 45,
        page: 2,
        limit: 10,
        totalPages: 5,
      },
    })

    const { getAdminDocumentsAction } = await import('@/app/actions/admin-documents')
    const result = await getAdminDocumentsAction({
      estado: 'en-revision',
      page: 2,
      limit: 10,
    })

    expect(apiGetMock).toHaveBeenCalledWith(
      '/documentos/admin/list?page=2&limit=10&estado=EN_REVISION',
    )
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.documents).toHaveLength(1)
      expect(result.data.total).toBe(45)
      expect(result.data.page).toBe(2)
      expect(result.data.totalPages).toBe(5)
      expect(result.data.documents[0]?.curadorNombre).toBe('Ana López')
      expect(result.data.documents[0]?.notasCount).toBe(1)
    }
  })

  it('propaga errores del API', async () => {
    apiGetMock.mockResolvedValueOnce({
      success: false,
      error: 'No autorizado',
      status: 403,
      code: 'HTTP_ERROR',
    })

    const { getAdminDocumentsAction } = await import('@/app/actions/admin-documents')
    const result = await getAdminDocumentsAction({ estado: 'publicados' })

    expect(result.success).toBe(false)
  })
})
