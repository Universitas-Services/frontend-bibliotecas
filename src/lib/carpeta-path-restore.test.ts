import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { CarpetaInternaDetalle } from '@/app/actions/temas'
import type { CarpetaInterna } from '@/lib/temas-taxonomy'
import { restoreCarpetaLevelsFromLeaf } from '@/lib/carpeta-path-restore'

vi.mock('@/app/actions/temas', () => ({
  getCarpetaInternaDetalleAction: vi.fn(),
  getCarpetasInternasHijosAction: vi.fn(),
  getTiposNormaAction: vi.fn(),
}))

import {
  getCarpetaInternaDetalleAction,
  getCarpetasInternasHijosAction,
  getTiposNormaAction,
} from '@/app/actions/temas'

const mockGetDetalle = vi.mocked(getCarpetaInternaDetalleAction)
const mockGetHijos = vi.mocked(getCarpetasInternasHijosAction)
const mockGetTiposNorma = vi.mocked(getTiposNormaAction)

function mockCarpeta(
  id: string,
  nombreCarpeta: string,
  parentId?: string | null,
): CarpetaInternaDetalle {
  return {
    id,
    nombreCarpeta,
    slug: id,
    ...(parentId !== undefined ? { parentId } : {}),
  }
}

describe('restoreCarpetaLevelsFromLeaf', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('reconstruye niveles desde la hoja hasta la raíz', async () => {
    mockGetDetalle.mockImplementation(async (id) => {
      if (id === 'leaf') return mockCarpeta('leaf', 'Municipal', 'mid')
      if (id === 'mid') return mockCarpeta('mid', 'Estadal', 'root')
      if (id === 'root') return mockCarpeta('root', 'Nacional', null)
      return null
    })

    mockGetTiposNorma.mockResolvedValue([mockCarpeta('root', 'Nacional') satisfies CarpetaInterna])
    mockGetHijos.mockImplementation(async (parentId) => {
      if (parentId === 'root') {
        return [mockCarpeta('mid', 'Estadal')]
      }
      return []
    })

    const result = await restoreCarpetaLevelsFromLeaf('sub-1', 'leaf')

    expect(result.leafId).toBe('leaf')
    expect(result.levels).toHaveLength(3)
    expect(result.levels[0].selectedId).toBe('root')
    expect(result.levels[1].selectedId).toBe('mid')
    expect(result.levels[2].selectedId).toBe('leaf')
    expect(result.pathNames).toEqual(['Nacional', 'Estadal', 'Municipal'])
  })

  it('devuelve vacío si faltan ids', async () => {
    const result = await restoreCarpetaLevelsFromLeaf('', 'leaf')
    expect(result).toEqual({ levels: [], leafId: '', pathNames: [] })
  })
})
