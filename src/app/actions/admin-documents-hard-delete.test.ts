import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { USER_MSG } from '@/lib/user-messages'

const apiDeleteMock = vi.fn()
const revalidatePathMock = vi.fn()

vi.mock('@/lib/api-client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api-client')>()
  return {
    ...actual,
    apiDelete: (...args: unknown[]) => apiDeleteMock(...args),
  }
})

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => revalidatePathMock(...args),
}))

describe('hardDeleteDocumentAction', () => {
  beforeEach(() => {
    vi.resetModules()
    apiDeleteMock.mockReset()
    revalidatePathMock.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('rechaza id vacío sin llamar al API', async () => {
    const { hardDeleteDocumentAction } = await import('@/app/actions/admin-documents')
    const result = await hardDeleteDocumentAction('   ')

    expect(apiDeleteMock).not.toHaveBeenCalled()
    expect(result).toEqual({
      success: false,
      error: 'El identificador del documento no es válido.',
      status: 400,
      code: 'HTTP_ERROR',
    })
  })

  it('elimina permanentemente con éxito y revalida el listado', async () => {
    apiDeleteMock.mockResolvedValueOnce({
      success: true,
      data: { message: 'Documento eliminado del sistema.' },
      status: 200,
    })

    const documentId = '550e8400-e29b-41d4-a716-446655440000'
    const { hardDeleteDocumentAction } = await import('@/app/actions/admin-documents')
    const result = await hardDeleteDocumentAction(documentId)

    expect(apiDeleteMock).toHaveBeenCalledWith(
      `/documentos/admin/${encodeURIComponent(documentId)}/hard-delete`,
    )
    expect(revalidatePathMock).toHaveBeenCalledWith('/admin/gestion-documental')
    expect(result).toEqual({
      success: true,
      message: 'Documento eliminado del sistema.',
    })
  })

  it('usa mensaje por defecto cuando el backend no devuelve message', async () => {
    apiDeleteMock.mockResolvedValueOnce({
      success: true,
      data: null,
      status: 204,
    })

    const { hardDeleteDocumentAction } = await import('@/app/actions/admin-documents')
    const result = await hardDeleteDocumentAction('doc-1')

    expect(result).toEqual({
      success: true,
      message: USER_MSG.success.documentHardDeleted,
    })
  })

  it('mapea 403 a mensaje de permisos de administrador', async () => {
    apiDeleteMock.mockResolvedValueOnce({
      success: false,
      error: 'Forbidden',
      status: 403,
      code: 'HTTP_ERROR',
    })

    const { hardDeleteDocumentAction } = await import('@/app/actions/admin-documents')
    const result = await hardDeleteDocumentAction('doc-1')

    expect(result).toEqual({
      success: false,
      error: USER_MSG.error.hardDeleteForbidden,
      status: 403,
      code: 'HTTP_ERROR',
    })
  })

  it('mapea 404 a documento inexistente', async () => {
    apiDeleteMock.mockResolvedValueOnce({
      success: false,
      error: 'Not found',
      status: 404,
      code: 'HTTP_ERROR',
    })

    const { hardDeleteDocumentAction } = await import('@/app/actions/admin-documents')
    const result = await hardDeleteDocumentAction('doc-missing')

    expect(result).toEqual({
      success: false,
      error: 'El documento ya no existe o el identificador no es válido.',
      status: 404,
      code: 'HTTP_ERROR',
    })
  })
})
