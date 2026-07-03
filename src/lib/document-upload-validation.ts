import { validateMetadatosForm, requiresPaisField } from '@/lib/metadata-schemas'
import { extractUploadTopLevelFields } from '@/lib/document-form-data'

function requiresPaisForSchema(schemaKey?: string | null): boolean {
  if (schemaKey === undefined) return true
  return requiresPaisField(schemaKey)
}

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

  if (requiresPaisForSchema(options.schemaKey) && !pais) {
    issues.push({
      field: 'pais',
      message: 'El país es obligatorio.',
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

    const metadatosPayload = options.metadatosValues ?? {}
    const topLevel = extractUploadTopLevelFields(metadatosPayload as Record<string, unknown>)

    if (!topLevel.enteEmisor) {
      issues.push({
        field: 'enteEmisor',
        message:
          'Indique el ente emisor (por ejemplo: dependencia administrativa, autor u organismo emisor).',
      })
    }

    if (!topLevel.fechaPublicacion) {
      issues.push({
        field: 'fechaPublicacion',
        message: 'Indique la fecha de publicación del documento.',
      })
    }
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
