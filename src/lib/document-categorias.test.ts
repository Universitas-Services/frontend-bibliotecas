import { describe, expect, it } from 'vitest'

import { extractDocumentCategorias, readCategoriaIdsFromDocument } from '@/lib/document-categorias'

describe('extractDocumentCategorias', () => {
  it('lee categorias hidratadas con id y nombre', () => {
    const result = extractDocumentCategorias({
      categorias: [
        { id: 'cat-1', nombre: 'Laboral' },
        { _id: 'cat-2', nombre: 'Penal' },
      ],
    })

    expect(result).toEqual([
      { id: 'cat-1', nombre: 'Laboral' },
      { id: 'cat-2', nombre: 'Penal' },
    ])
  })

  it('lee categoriaIds como strings cuando no hay categorias', () => {
    const result = extractDocumentCategorias({
      categoriaIds: ['cat-a', 'cat-b'],
    })

    expect(result).toEqual([
      { id: 'cat-a', nombre: 'Categoría asignada' },
      { id: 'cat-b', nombre: 'Categoría asignada' },
    ])
  })

  it('prioriza categorias sobre categoriaIds', () => {
    const result = extractDocumentCategorias({
      categorias: [{ id: 'cat-1', nombre: 'Civil' }],
      categoriaIds: ['cat-99'],
    })

    expect(result).toEqual([{ id: 'cat-1', nombre: 'Civil' }])
  })

  it('readCategoriaIdsFromDocument devuelve solo ids', () => {
    expect(
      readCategoriaIdsFromDocument({
        categorias: [{ id: 'cat-1', nombre: 'Tributario' }],
      }),
    ).toEqual(['cat-1'])
  })
})
