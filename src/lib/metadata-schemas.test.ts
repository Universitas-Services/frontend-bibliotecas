import { describe, expect, it } from 'vitest'

import { buildDocumentMultipartPayload } from '@/lib/document-form-data'
import { buildMetadatosFromForm, resolveMetadataSchemaKey } from '@/lib/metadata-schemas'

describe('metadata-schemas', () => {
  it('resolves legislacion municipal from path', () => {
    expect(resolveMetadataSchemaKey('Legislación', ['Nacional', 'Municipal', 'Ordenanza'])).toBe(
      'legislacion-municipal',
    )
  })

  it('builds legislacion nacional metadatos', () => {
    const result = buildMetadatosFromForm('legislacion-nacional', {
      rango: 'Ley Orgánica',
      numeroGaceta: '42123',
      fechaPromulgacion: '2024-05-12',
    })

    expect(result.rango).toBe('Ley Orgánica')
    expect(result.ambitoGeografico).toBe('Nacional')
  })
})

describe('buildDocumentMultipartPayload', () => {
  it('includes metadatos JSON, etiquetas and categoriaIds', () => {
    const outbound = new FormData()
    outbound.set('tituloIntegro', 'Ley test')
    outbound.set('nombreBreve', 'Ley test')
    outbound.set('resumen', 'Resumen')
    outbound.set('pais', 'Venezuela')
    outbound.set('ocrHabilitado', 'true')
    outbound.set('etiquetas', JSON.stringify(['derecho', 'urbanismo']))

    const payload = buildDocumentMultipartPayload({
      outbound,
      categorias: ['cat-1', 'cat-2'],
      classification: {
        tipoDocumentoId: 'sub-1',
        carpetaInternaId: 'carpeta-1',
      },
      metadatos: { rango: 'Ley Orgánica', numeroGaceta: '123' },
    })

    expect(payload.get('metadatos')).toBe(
      JSON.stringify({ rango: 'Ley Orgánica', numeroGaceta: '123' }),
    )
    expect(payload.get('etiquetas')).toBe(JSON.stringify(['derecho', 'urbanismo']))
    expect(payload.get('categoriaIds')).toBe(JSON.stringify(['cat-1', 'cat-2']))
    expect(payload.get('ocrHabilitado')).toBe('true')
    expect(payload.get('subcarpetaNormaId')).toBe('sub-1')
    expect(payload.get('carpetaInternaId')).toBe('carpeta-1')
  })
})
