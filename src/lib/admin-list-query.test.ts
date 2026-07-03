import { describe, expect, it } from 'vitest'

import { buildAdminListPath } from '@/lib/admin-list-query'

describe('buildAdminListPath', () => {
  it('envía page, limit y estado al backend', () => {
    const path = buildAdminListPath({
      page: 2,
      limit: 10,
      estado: 'en-revision',
    })

    expect(path).toContain('/documentos/admin/list?')
    expect(path).toContain('page=2')
    expect(path).toContain('limit=10')
    expect(path).toContain('estado=EN_REVISION')
  })

  it('mapea publicados y todos', () => {
    expect(buildAdminListPath({ estado: 'publicados' })).toContain('estado=PUBLICADOS')
    expect(buildAdminListPath({ estado: 'todos' })).toContain('estado=TODOS')
  })

  it('incluye filtros de curador y notas', () => {
    const path = buildAdminListPath({
      curadorId: 'curador-uuid',
      conNotas: true,
      estado: 'en-revision',
    })

    expect(path).toContain('curadorId=curador-uuid')
    expect(path).toContain('conNotas=true')
  })
})
