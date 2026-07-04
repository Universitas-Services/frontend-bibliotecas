import { describe, expect, it } from 'vitest'

import {
  formatUploadValidationIssues,
  validateBorradorForm,
  validateClassificationForm,
  validateDocumentPublishRequirements,
  validateDocumentUploadForm,
  validateLegalIdentificationForm,
} from '@/lib/document-upload-validation'
import { USER_MSG } from '@/lib/user-messages'

const completeClassification = {
  temaPrincipalId: 'tema-uuid',
  tipoDocumentoId: 'tipo-doc-uuid',
  carpetaInternaId: 'carpeta-hoja-uuid',
}

const completeLegalIdentification = {
  tituloIntegro: 'Ley orgánica de ejemplo',
  nombreBreve: 'Ley ejemplo 2024',
}

const completePublishMetadatos = {
  dependenciaAdministrativa: 'Concejo Municipal',
  fechaPromulgacion: '2024-05-12',
}

describe('validateLegalIdentificationForm', () => {
  it('exige título oficial y nombre breve', () => {
    const issues = validateLegalIdentificationForm(new FormData())

    expect(issues).toHaveLength(2)
    expect(formatUploadValidationIssues(issues)).toContain(
      USER_MSG.validation.tituloIntegroRequired,
    )
    expect(formatUploadValidationIssues(issues)).toContain(USER_MSG.validation.nombreBreveRequired)
  })
})

describe('validateClassificationForm', () => {
  it('exige tema, tipo documental y carpeta final', () => {
    const issues = validateClassificationForm({})

    expect(issues).toHaveLength(3)
    expect(formatUploadValidationIssues(issues)).toContain(USER_MSG.validation.temaRequired)
    expect(formatUploadValidationIssues(issues)).toContain(
      USER_MSG.validation.tipoDocumentoRequired,
    )
    expect(formatUploadValidationIssues(issues)).toContain(USER_MSG.validation.classification)
  })

  it('pasa cuando la clasificación está completa', () => {
    expect(validateClassificationForm(completeClassification)).toEqual([])
  })
})

describe('validateDocumentPublishRequirements', () => {
  it('exige categorías, ente emisor y fecha de publicación', () => {
    const formData = new FormData()
    const issues = validateDocumentPublishRequirements(formData, { metadatos: {} })

    expect(issues).toHaveLength(3)
    expect(formatUploadValidationIssues(issues)).toContain(USER_MSG.validation.categorias)
    expect(formatUploadValidationIssues(issues)).toContain(USER_MSG.validation.enteEmisorRequired)
    expect(formatUploadValidationIssues(issues)).toContain(
      USER_MSG.validation.fechaPublicacionRequired,
    )
  })
})

describe('validateDocumentUploadForm', () => {
  it('exige identificación legal y clasificación en formulario vacío', () => {
    const formData = new FormData()

    const issues = validateDocumentUploadForm(formData)

    expect(issues.length).toBeGreaterThanOrEqual(5)
    expect(formatUploadValidationIssues(issues)).toContain(
      USER_MSG.validation.tituloIntegroRequired,
    )
  })

  it('pasa con datos mínimos de publicación completos', () => {
    const formData = new FormData()
    formData.append('tituloIntegro', completeLegalIdentification.tituloIntegro)
    formData.append('nombreBreve', completeLegalIdentification.nombreBreve)
    formData.append('subcarpetaNormaId', completeClassification.tipoDocumentoId)
    formData.append('carpetaInternaId', completeClassification.carpetaInternaId)
    formData.append('categoriaIds', 'cat-uuid-1')

    expect(
      validateDocumentUploadForm(formData, {
        classification: completeClassification,
        metadatos: completePublishMetadatos,
      }),
    ).toEqual([])
  })
})

describe('validateBorradorForm', () => {
  it('exige identificación legal y clasificación', () => {
    const formData = new FormData()

    const issues = validateBorradorForm(formData, completeClassification)

    expect(issues).toHaveLength(2)
    expect(formatUploadValidationIssues(issues)).toContain(
      USER_MSG.validation.tituloIntegroRequired,
    )
    expect(formatUploadValidationIssues(issues)).toContain(USER_MSG.validation.nombreBreveRequired)
  })

  it('pasa con identificación y clasificación completas sin categorías ni metadatos', () => {
    const formData = new FormData()
    formData.append('tituloIntegro', completeLegalIdentification.tituloIntegro)
    formData.append('nombreBreve', completeLegalIdentification.nombreBreve)

    expect(validateBorradorForm(formData, completeClassification)).toEqual([])
  })
})
