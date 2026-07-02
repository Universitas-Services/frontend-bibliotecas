import { describe, expect, it } from 'vitest'

import { buildDocumentMultipartPayload } from '@/lib/document-form-data'
import {
  buildMetadatosFromForm,
  METADATA_SCHEMAS,
  resolveMetadataSchemaKey,
} from '@/lib/metadata-schemas'

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

  it('incluye parroquia en legislacion municipal', () => {
    const schema = METADATA_SCHEMAS['legislacion-municipal']
    expect(schema.fields.some((field) => field.key === 'parroquia')).toBe(true)
    expect(schema.fields.find((field) => field.key === 'parroquia')?.optionSource).toBe(
      'global-parroquia',
    )
  })

  it('resuelve esquemas de jurisprudencia segun la clasificacion', () => {
    expect(
      resolveMetadataSchemaKey('Jurisprudencia', ['Nacional', 'Tribunal Supremo de Justicia']),
    ).toBe('jurisprudencia-tsj')
    expect(
      resolveMetadataSchemaKey('Jurisprudencia', [
        'Nacional',
        'Cortes Contencioso Administrativas',
      ]),
    ).toBe('jurisprudencia-contencioso')
    expect(resolveMetadataSchemaKey('Jurisprudencia', ['Nacional', 'Tribunales'])).toBe(
      'jurisprudencia-tribunales',
    )
    expect(resolveMetadataSchemaKey('Jurisprudencia', ['Internacional'])).toBe(
      'jurisprudencia-internacional',
    )
  })

  it('cascada tribunales: estado, municipio opcional y tribunal', () => {
    const schema = METADATA_SCHEMAS['jurisprudencia-tribunales']
    expect(schema.fields.slice(0, 3).map((field) => field.key)).toEqual([
      'estado',
      'municipio',
      'tribunal',
    ])
    expect(schema.fields.find((field) => field.key === 'municipio')?.required).toBe(false)
    expect(schema.fields.find((field) => field.key === 'tribunal')?.optionSource).toBe(
      'global-tribunal',
    )
  })

  it('tsj incluye las siete salas del diagrama', () => {
    const schema = METADATA_SCHEMAS['jurisprudencia-tsj']
    const salaField = schema.fields.find((field) => field.key === 'sala')
    expect(salaField?.options?.map((option) => option.value)).toEqual([
      'Sala Constitucional',
      'Sala Político-Administrativa',
      'Sala Electoral',
      'Sala de Casación Civil',
      'Sala de Casación Penal',
      'Sala de Casación Social',
      'Sala Plena',
    ])
  })

  it('persiste pares id+nombre en metadatos territoriales', () => {
    const result = buildMetadatosFromForm('legislacion-municipal', {
      estado: 'Miranda',
      estadoId: '14',
      municipio: 'Baruta',
      municipioId: '102',
      parroquia: 'Baruta',
      parroquiaId: '501',
      rango: 'Ordenanza',
      numeroGacetaMunicipal: '123',
      fechaPromulgacion: '2024-05-12',
    })

    expect(result.estado).toBe('Miranda')
    expect(result.estadoId).toBe(14)
    expect(result.municipio).toBe('Baruta')
    expect(result.municipioId).toBe(102)
    expect(result.parroquia).toBe('Baruta')
    expect(result.parroquiaId).toBe(501)
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
    expect(payload.getAll('categoriaIds')).toEqual(['cat-1', 'cat-2'])
    expect(payload.get('ocrHabilitado')).toBe('true')
    expect(payload.get('subcarpetaNormaId')).toBe('sub-1')
    expect(payload.get('carpetaInternaId')).toBe('carpeta-1')
  })

  it('envía enteEmisor, fechaPublicacion y categoriaIds como campos de primer nivel', () => {
    const outbound = new FormData()
    outbound.set('tituloIntegro', 'Consulta administrativa')

    const payload = buildDocumentMultipartPayload({
      outbound,
      categorias: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
      classification: { tipoDocumentoId: 'sub-1', carpetaInternaId: 'carpeta-1' },
      metadatos: {
        dependenciaAdministrativa: 'Ministerio de Prueba',
        fechaPublicacion: '2024-06-15',
        numeroDocumento: 'DOC-001',
      },
    })

    expect(payload.get('enteEmisor')).toBe('Ministerio de Prueba')
    expect(payload.get('fechaPublicacion')).toBe('2024-06-15')
    expect(payload.getAll('categoriaIds')).toEqual(['3fa85f64-5717-4562-b3fc-2c963f66afa6'])
  })

  it('coloca file al final del FormData (upload, borrador, reforma, editar)', () => {
    const outbound = new FormData()
    outbound.set('tituloIntegro', 'Documento test')
    const file = new File(['pdf'], 'documento.pdf', { type: 'application/pdf' })

    const payload = buildDocumentMultipartPayload({
      outbound,
      categorias: ['cat-uuid'],
      classification: { tipoDocumentoId: 'sub-1' },
      file,
    })

    const keys = [...payload.keys()]
    expect(keys[keys.length - 1]).toBe('file')
    expect(payload.get('file')).toBeInstanceOf(File)
  })
})
