import { describe, expect, it } from 'vitest'

import {
  formatUploadValidationIssues,
  validateDocumentUploadForm,
} from '@/lib/document-upload-validation'

describe('validateDocumentUploadForm', () => {
  it('flags missing required metadata', () => {
    const formData = new FormData()
    formData.append('file', new File(['x'], 'doc.pdf'))

    const issues = validateDocumentUploadForm(formData)

    expect(issues.length).toBeGreaterThan(0)
    expect(formatUploadValidationIssues(issues)).toContain('título')
    expect(formatUploadValidationIssues(issues)).toContain('resumen')
    expect(formatUploadValidationIssues(issues)).toContain('clasificación interna')
  })

  it('passes when required fields are present', () => {
    const formData = new FormData()
    formData.append('tituloIntegro', 'Ley de prueba')
    formData.append('resumen', 'Resumen de prueba')
    formData.append('subcarpetaNormaId', 'uuid-tipo-doc')
    formData.append('carpetaInternaId', 'uuid-carpeta-hoja')
    formData.append('pais', 'Venezuela')
    formData.append('categoriaIds', 'cat-uuid-1')

    expect(
      validateDocumentUploadForm(formData, {
        schemaKey: 'legislacion-nacional',
        metadatosValues: {
          rango: 'Ley Orgánica',
          numeroGaceta: '42123',
          fechaPromulgacion: '2024-01-15',
          ambitoGeografico: 'Nacional',
        },
      }),
    ).toEqual([])
  })
})
