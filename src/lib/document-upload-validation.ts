import { USER_MSG } from '@/lib/user-messages'

export type UploadValidationIssue = {
  field: string
  message: string
}

export type ClassificationValidationInput = {
  temaPrincipalId?: string
  tipoDocumentoId?: string
  carpetaInternaId?: string
}

type ValidateDocumentUploadOptions = {
  classification?: ClassificationValidationInput
}

function readClassificationFromForm(
  formData: FormData,
  classification?: ClassificationValidationInput,
): ClassificationValidationInput {
  return {
    temaPrincipalId:
      classification?.temaPrincipalId?.trim() ||
      String(formData.get('temaPrincipalId') ?? '').trim() ||
      undefined,
    tipoDocumentoId:
      classification?.tipoDocumentoId?.trim() ||
      String(formData.get('subcarpetaNormaId') ?? '').trim() ||
      undefined,
    carpetaInternaId:
      classification?.carpetaInternaId?.trim() ||
      String(formData.get('carpetaInternaId') ?? '').trim() ||
      undefined,
  }
}

export function validateLegalIdentificationForm(formData: FormData): UploadValidationIssue[] {
  const issues: UploadValidationIssue[] = []

  const tituloIntegro = String(formData.get('tituloIntegro') ?? '').trim()
  const nombreBreve = String(formData.get('nombreBreve') ?? '').trim()

  if (!tituloIntegro) {
    issues.push({
      field: 'tituloIntegro',
      message: USER_MSG.validation.tituloIntegroRequired,
    })
  }

  if (!nombreBreve) {
    issues.push({
      field: 'nombreBreve',
      message: USER_MSG.validation.nombreBreveRequired,
    })
  }

  return issues
}

export function validateClassificationForm(
  input: ClassificationValidationInput,
): UploadValidationIssue[] {
  const issues: UploadValidationIssue[] = []

  if (!input.temaPrincipalId?.trim()) {
    issues.push({
      field: 'temaPrincipalId',
      message: USER_MSG.validation.temaRequired,
    })
  }

  if (!input.tipoDocumentoId?.trim()) {
    issues.push({
      field: 'subcarpetaNormaId',
      message: USER_MSG.validation.tipoDocumentoRequired,
    })
  }

  if (!input.carpetaInternaId?.trim()) {
    issues.push({
      field: 'carpetaInternaId',
      message: USER_MSG.validation.classification,
    })
  }

  return issues
}

function validateUploadMinimumForm(
  formData: FormData,
  options: ValidateDocumentUploadOptions = {},
): UploadValidationIssue[] {
  const classification = readClassificationFromForm(formData, options.classification)
  return [
    ...validateLegalIdentificationForm(formData),
    ...validateClassificationForm(classification),
  ]
}

export function validateDocumentUploadForm(
  formData: FormData,
  options: ValidateDocumentUploadOptions = {},
): UploadValidationIssue[] {
  return validateUploadMinimumForm(formData, options)
}

export function validateBorradorForm(
  formData: FormData,
  classification?: ClassificationValidationInput,
): UploadValidationIssue[] {
  return validateUploadMinimumForm(formData, { classification })
}

export function formatUploadValidationIssues(issues: UploadValidationIssue[]): string {
  return issues.map((issue) => issue.message).join('\n')
}
