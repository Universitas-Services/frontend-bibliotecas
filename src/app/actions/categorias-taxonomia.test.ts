import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const apiGetMock = vi.fn()
const apiPatchMock = vi.fn()
const apiPostMock = vi.fn()
const revalidatePathMock = vi.fn()

vi.mock('@/lib/api-client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api-client')>()
  return {
    ...actual,
    apiGet: (...args: unknown[]) => apiGetMock(...args),
    apiPatch: (...args: unknown[]) => apiPatchMock(...args),
    apiPost: (...args: unknown[]) => apiPostMock(...args),
  }
})

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => revalidatePathMock(...args),
}))

describe('categorias taxonomia actions', () => {
  beforeEach(() => {
    vi.resetModules()
    apiGetMock.mockReset()
    apiPatchMock.mockReset()
    apiPostMock.mockReset()
    revalidatePathMock.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('getCategoriasAprobadasAction consulta GET /categorias', async () => {
    apiGetMock.mockResolvedValueOnce({
      success: true,
      data: [{ id: 'cat-1', nombre: 'Penal', estado: 'APROBADA' }],
      status: 200,
    })

    const { getCategoriasAprobadasAction } = await import('@/app/actions/categorias')
    const result = await getCategoriasAprobadasAction()

    expect(apiGetMock).toHaveBeenCalledWith('/categorias')
    expect(result[0]?.nombre).toBe('Penal')
  })

  it('sugerirCategoriaAction envía POST /categorias/sugerir', async () => {
    apiPostMock.mockResolvedValueOnce({
      success: true,
      data: { id: 'cat-2', nombre: 'Ambiental', estado: 'SUGERIDA' },
      status: 201,
    })

    const { sugerirCategoriaAction } = await import('@/app/actions/categorias')
    const result = await sugerirCategoriaAction('Ambiental', 'Rama ambiental')

    expect(apiPostMock).toHaveBeenCalledWith('/categorias/sugerir', {
      nombre: 'Ambiental',
      descripcion: 'Rama ambiental',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.estado).toBe('SUGERIDA')
    }
  })

  it('rechazarCategoriaAction revalida la página admin', async () => {
    apiPatchMock.mockResolvedValueOnce({ success: true, data: null, status: 200 })

    const { rechazarCategoriaAction } = await import('@/app/actions/categorias')
    const result = await rechazarCategoriaAction('cat-3')

    expect(apiPatchMock).toHaveBeenCalledWith('/categorias/cat-3/rechazar', {})
    expect(revalidatePathMock).toHaveBeenCalledWith('/admin/taxonomia/categorias')
    expect(result).toEqual({ success: true })
  })
})
