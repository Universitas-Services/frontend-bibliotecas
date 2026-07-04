import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const apiDeleteMock = vi.fn()
const apiGetMock = vi.fn()
const apiPatchMock = vi.fn()
const apiPostMock = vi.fn()
const revalidatePathMock = vi.fn()

vi.mock('@/lib/api-client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api-client')>()
  return {
    ...actual,
    apiDelete: (...args: unknown[]) => apiDeleteMock(...args),
    apiGet: (...args: unknown[]) => apiGetMock(...args),
    apiPatch: (...args: unknown[]) => apiPatchMock(...args),
    apiPost: (...args: unknown[]) => apiPostMock(...args),
  }
})

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => revalidatePathMock(...args),
}))

describe('etiquetas actions', () => {
  beforeEach(() => {
    vi.resetModules()
    apiDeleteMock.mockReset()
    apiGetMock.mockReset()
    apiPatchMock.mockReset()
    apiPostMock.mockReset()
    revalidatePathMock.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('getEtiquetasAprobadasAction normaliza la respuesta', async () => {
    apiGetMock.mockResolvedValueOnce({
      success: true,
      data: [{ id: '1', nombre: 'Laboral', estado: 'APROBADA' }],
      status: 200,
    })

    const { getEtiquetasAprobadasAction } = await import('@/app/actions/etiquetas')
    const result = await getEtiquetasAprobadasAction()

    expect(apiGetMock).toHaveBeenCalledWith('/etiquetas')
    expect(result).toEqual([
      { id: '1', nombre: 'Laboral', estado: 'APROBADA', sugeridoPorId: null },
    ])
  })

  it('createEtiquetaAction rechaza nombre vacío', async () => {
    const { createEtiquetaAction } = await import('@/app/actions/etiquetas')
    const formData = new FormData()
    formData.set('nombre', '   ')

    const result = await createEtiquetaAction(null, formData)

    expect(apiPostMock).not.toHaveBeenCalled()
    expect(result).toEqual({
      success: false,
      error: 'El nombre es obligatorio.',
      status: 400,
      code: 'HTTP_ERROR',
    })
  })

  it('deleteEtiquetaAction elimina y revalida', async () => {
    apiDeleteMock.mockResolvedValueOnce({ success: true, data: null, status: 204 })

    const { deleteEtiquetaAction } = await import('@/app/actions/etiquetas')
    const result = await deleteEtiquetaAction('etq-1')

    expect(apiDeleteMock).toHaveBeenCalledWith('/etiquetas/etq-1')
    expect(revalidatePathMock).toHaveBeenCalledWith('/admin/taxonomia/etiquetas')
    expect(result).toEqual({ success: true })
  })

  it('aprobarEtiquetaAction usa PATCH /aprobar', async () => {
    apiPatchMock.mockResolvedValueOnce({ success: true, data: null, status: 200 })

    const { aprobarEtiquetaAction } = await import('@/app/actions/etiquetas')
    const result = await aprobarEtiquetaAction('etq-2')

    expect(apiPatchMock).toHaveBeenCalledWith('/etiquetas/etq-2/aprobar', {})
    expect(result).toEqual({ success: true })
  })
})
