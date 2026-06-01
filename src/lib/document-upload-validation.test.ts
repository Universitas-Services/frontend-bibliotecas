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
    expect(formatUploadValidationIssues(issues)).toContain('fecha de publicación')
  })

  it('passes when required fields are present', () => {
    const formData = new FormData()
    formData.append('tituloIntegro', 'Ley de prueba')
    formData.append('fechaPublicacion', '2024-01-15')
    formData.append('enteEmisor', 'Ministerio')
    formData.append('tipoNorma', 'decreto')

    expect(validateDocumentUploadForm(formData)).toEqual([])
  })
})
