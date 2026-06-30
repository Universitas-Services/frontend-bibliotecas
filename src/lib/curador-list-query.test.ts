import { describe, expect, it } from 'vitest'

import { buildCuradorListPath } from '@/lib/curador-list-query'
import { mapFilterTabToBackendEstado, mapTimeFilterToBackend } from '@/lib/document-status'

describe('curador list query mapping', () => {
  it('omite estado cuando el tab es todos', () => {
    expect(mapFilterTabToBackendEstado('todos')).toBeUndefined()
    expect(mapFilterTabToBackendEstado(undefined)).toBeUndefined()
    expect(buildCuradorListPath({ page: 1, limit: 10 })).toBe(
      '/documentos/curador/list?page=1&limit=10',
    )
  })

  it('mapea tabs de estado al enum del backend', () => {
    expect(mapFilterTabToBackendEstado('publicados')).toBe('PUBLICADOS')
    expect(mapFilterTabToBackendEstado('en-revision')).toBe('EN_REVISION')
    expect(mapFilterTabToBackendEstado('borradores')).toBe('BORRADORES')
    expect(mapFilterTabToBackendEstado('rechazados')).toBe('RECHAZADOS')
  })

  it('mapea filtros de tiempo al enum del backend', () => {
    expect(mapTimeFilterToBackend('7d')).toBe('7_DIAS')
    expect(mapTimeFilterToBackend('30d')).toBe('30_DIAS')
    expect(mapTimeFilterToBackend('90d')).toBe('3_MESES')
  })

  it('construye la ruta con todos los query params', () => {
    const path = buildCuradorListPath({
      page: 2,
      limit: 20,
      estado: 'borradores',
      tiempo: '7d',
      busqueda: 'Ley Orgánica',
    })

    expect(path).toContain('/documentos/curador/list?')
    expect(path).toContain('page=2')
    expect(path).toContain('limit=20')
    expect(path).toContain('estado=BORRADORES')
    expect(path).toContain('tiempo=7_DIAS')
    expect(path).toContain('busqueda=Ley+Org')
  })
})
