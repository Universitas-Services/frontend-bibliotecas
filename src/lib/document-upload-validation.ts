export type UploadValidationIssue = {
  field: string
  message: string
}

export function validateDocumentUploadForm(formData: FormData): UploadValidationIssue[] {
  const issues: UploadValidationIssue[] = []

  const tituloIntegro = String(formData.get('tituloIntegro') ?? '').trim()
  const fechaPublicacion = String(formData.get('fechaPublicacion') ?? '').trim()
  const enteEmisor = String(formData.get('enteEmisor') ?? '').trim()
  const tipoNorma = String(formData.get('tipoNorma') ?? '').trim()

  if (!tituloIntegro) {
    issues.push({
      field: 'tituloIntegro',
      message: 'El título oficial es obligatorio.',
    })
  }

  if (!fechaPublicacion) {
    issues.push({
      field: 'fechaPublicacion',
      message: 'La fecha de publicación es obligatoria.',
    })
  }

  if (!enteEmisor) {
    issues.push({
      field: 'enteEmisor',
      message: 'El ente emisor es obligatorio.',
    })
  }

  if (!tipoNorma) {
    issues.push({
      field: 'tipoNorma',
      message: 'Seleccione un tipo de norma.',
    })
  }

  return issues
}

export function formatUploadValidationIssues(issues: UploadValidationIssue[]): string {
  return issues.map((issue) => issue.message).join(' ')
}
