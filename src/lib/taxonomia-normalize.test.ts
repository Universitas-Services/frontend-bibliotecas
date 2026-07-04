import { describe, expect, it } from 'vitest'

import {
  normalizeCategoriaItem,
  normalizeEtiquetaItem,
  normalizeSugerenciaPendiente,
  normalizeTaxonomiaList,
} from '@/lib/taxonomia-normalize'

describe('taxonomia-normalize', () => {
  it('normalizeTaxonomiaList acepta arreglo plano o envoltorio data', () => {
    expect(normalizeTaxonomiaList([{ id: '1' }])).toHaveLength(1)
    expect(normalizeTaxonomiaList({ data: [{ id: '2' }] })).toHaveLength(1)
    expect(normalizeTaxonomiaList(null)).toEqual([])
  })

  it('normalizeEtiquetaItem asigna APROBADA por defecto', () => {
    expect(normalizeEtiquetaItem({ id: '1', nombre: 'Laboral' })).toMatchObject({
      id: '1',
      nombre: 'Laboral',
      estado: 'APROBADA',
    })
  })

  it('normalizeSugerenciaPendiente incluye sugeridoPor', () => {
    const item = normalizeSugerenciaPendiente({
      id: '3',
      nombre: 'Nueva',
      estado: 'SUGERIDA',
      sugeridoPor: { id: 'u1', email: 'curador@test.com', role: 'CURADOR' },
    })

    expect(item.estado).toBe('SUGERIDA')
    expect(item.sugeridoPor?.email).toBe('curador@test.com')
  })

  it('normalizeCategoriaItem conserva descripcion', () => {
    expect(
      normalizeCategoriaItem({ id: 'c1', nombre: 'Civil', descripcion: 'Rama civil' }),
    ).toMatchObject({
      nombre: 'Civil',
      descripcion: 'Rama civil',
    })
  })
})
