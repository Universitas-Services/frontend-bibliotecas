import { validateMetadatosForm } from '@/lib/metadata-schemas'

export type UploadValidationIssue = {
  field: string
  message: string
}

type ValidateDocumentUploadOptions = {
  schemaKey?: string | null
  metadatosValues?: Record<string, string>
}

export function validateDocumentUploadForm(
  formData: FormData,
  options: ValidateDocumentUploadOptions = {},
): UploadValidationIssue[] {
  const issues: UploadValidationIssue[] = []

  const tituloIntegro = String(formData.get('tituloIntegro') ?? '').trim()
  const subcarpetaNormaId = String(formData.get('subcarpetaNormaId') ?? '').trim()
  const carpetaInternaId = String(formData.get('carpetaInternaId') ?? '').trim()
  const pais = String(formData.get('pais') ?? '').trim()
  const resumen = String(formData.get('resumen') ?? '').trim()

  if (!subcarpetaNormaId) {
    issues.push({
      field: 'subcarpetaNormaId',
      message: 'Seleccione el tipo documental.',
    })
  }

  if (!carpetaInternaId) {
    issues.push({
      field: 'carpetaInternaId',
      message: 'Complete la clasificación interna hasta el nivel final.',
    })
  }

  if (!tituloIntegro) {
    issues.push({
      field: 'tituloIntegro',
      message: 'El título oficial es obligatorio.',
    })
  }

  if (!pais) {
    issues.push({
      field: 'pais',
      message: 'El país es obligatorio.',
    })
  }

  if (!resumen) {
    issues.push({
      field: 'resumen',
      message: 'El resumen descriptivo es obligatorio.',
    })
  }

  const categoriaIds = formData.getAll('categoriaIds').filter((value) => String(value).trim())
  if (categoriaIds.length === 0) {
    issues.push({
      field: 'categoriaIds',
      message: 'Debe asignar al menos una categoría.',
    })
  }

  if (options.schemaKey !== undefined) {
    issues.push(...validateMetadatosForm(options.schemaKey ?? null, options.metadatosValues ?? {}))
  }

  return issues
}

export function validateBorradorForm(formData: FormData): UploadValidationIssue[] {
  const issues: UploadValidationIssue[] = []
  const tituloIntegro = String(formData.get('tituloIntegro') ?? '').trim()

  if (!tituloIntegro) {
    issues.push({
      field: 'tituloIntegro',
      message: 'El título oficial es obligatorio para guardar el borrador.',
    })
  }

  return issues
}

export function formatUploadValidationIssues(issues: UploadValidationIssue[]): string {
  return issues.map((issue) => issue.message).join('\n')
}
