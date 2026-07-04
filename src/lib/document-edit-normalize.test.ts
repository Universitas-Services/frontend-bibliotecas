import { describe, expect, it } from 'vitest'

import {
  extractDocumentEditClassification,
  extractDocumentEditSnapshot,
  mergeDocumentMetadatosForEdit,
} from '@/lib/document-edit-normalize'
import { extractDocumentEtiquetas, extractDocumentKeywords } from '@/lib/document-etiquetas'

describe('extractDocumentEditClassification', () => {
  it('infiere tema y tipo desde objetos anidados del GET', () => {
    const result = extractDocumentEditClassification({
      subcarpetaNormaId: 'sub-1',
      carpetaInternaId: 'leaf-9',
      subcarpetaNorma: {
        id: 'sub-1',
        nombre: 'Ley',
        tipoNorma: 'Ley',
        temaPrincipal: { id: 'tema-3', nombre: 'Derecho laboral' },
      },
      carpetaInterna: { id: 'leaf-9', nombre: 'Nacional' },
    })

    expect(result).toMatchObject({
      temaPrincipalId: 'tema-3',
      temaPrincipalNombre: 'Derecho laboral',
      tipoDocumentoId: 'sub-1',
      tipoDocumentoNombre: 'Ley',
      carpetaInternaId: 'leaf-9',
      subcarpetaNormaId: 'sub-1',
    })
  })
})

describe('mergeDocumentMetadatosForEdit', () => {
  it('combina metadatos JSON con campos de primer nivel', () => {
    const result = mergeDocumentMetadatosForEdit({
      metadatos: { numeroGaceta: '123' },
      enteEmisor: 'TSJ',
      fechaPublicacion: '2024-05-01',
    })

    expect(result).toEqual({
      numeroGaceta: '123',
      enteEmisor: 'TSJ',
      fechaPublicacion: '2024-05-01',
    })
  })

  it('no sobrescribe claves ya presentes en metadatos', () => {
    const result = mergeDocumentMetadatosForEdit({
      metadatos: { enteEmisor: 'Desde JSON' },
      enteEmisor: 'Desde raíz',
    })

    expect(result.enteEmisor).toBe('Desde JSON')
  })
})

describe('extractDocumentEtiquetas', () => {
  it('lee nombres desde objetos etiqueta', () => {
    expect(
      extractDocumentEtiquetas({
        etiquetas: [
          { id: 'e1', nombre: 'Reforma' },
          { id: 'e2', nombre: 'Laboral' },
        ],
      }),
    ).toEqual(['Reforma', 'Laboral'])
  })
})

describe('extractDocumentKeywords', () => {
  it('prioriza palabrasClave sobre keywords legacy', () => {
    expect(
      extractDocumentKeywords({
        palabrasClave: ['gaceta', 'venezuela'],
        keywords: ['legacy'],
      }),
    ).toEqual(['gaceta', 'venezuela'])
  })
})

describe('extractDocumentEditSnapshot', () => {
  it('arma snapshot completo para rehidratación', () => {
    const snapshot = extractDocumentEditSnapshot({
      subcarpetaNormaId: 'sub-1',
      carpetaInternaId: 'leaf-1',
      subcarpetaNorma: {
        id: 'sub-1',
        nombre: 'Decreto',
        temaPrincipal: { id: 'tema-1', nombre: 'Administrativo' },
      },
      metadatos: { numeroGaceta: '456' },
      enteEmisor: 'Presidencia',
      etiquetas: [{ id: 'e1', nombre: 'Urgente' }],
      palabrasClave: ['decreto'],
    })

    expect(snapshot.classification.temaPrincipalId).toBe('tema-1')
    expect(snapshot.metadatos).toMatchObject({
      numeroGaceta: '456',
      enteEmisor: 'Presidencia',
    })
    expect(snapshot.etiquetas).toEqual(['Urgente'])
    expect(snapshot.keywords).toEqual(['decreto'])
  })
})
