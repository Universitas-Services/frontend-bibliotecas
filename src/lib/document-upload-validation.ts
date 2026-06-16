export type UploadValidationIssue = {
  field: string
  message: string
}

export function validateDocumentUploadForm(formData: FormData): UploadValidationIssue[] {
  const issues: UploadValidationIssue[] = []

  const tituloIntegro = String(formData.get('tituloIntegro') ?? '').trim()
  const subcarpetaNormaId = String(formData.get('subcarpetaNormaId') ?? '').trim()
  const enteEmisor = String(formData.get('enteEmisor') ?? '').trim()
  const fechaPublicacion = String(formData.get('fechaPublicacion') ?? '').trim()
  const pais = String(formData.get('pais') ?? '').trim()
  const ambitoTerritorial = String(formData.get('ambitoTerritorial') ?? '').trim()

  if (!subcarpetaNormaId) {
    issues.push({
      field: 'subcarpetaNormaId',
      message: 'Seleccione la clasificación completa del documento (tema y tipo de documento).',
    })
  }

  if (!tituloIntegro) {
    issues.push({
      field: 'tituloIntegro',
      message: 'El título oficial es obligatorio.',
    })
  }

  if (!enteEmisor) {
    issues.push({
      field: 'enteEmisor',
      message: 'El ente emisor es obligatorio.',
    })
  }

  if (!fechaPublicacion) {
    issues.push({
      field: 'fechaPublicacion',
      message: 'La fecha de publicación es obligatoria.',
    })
  }

  if (!ambitoTerritorial) {
    issues.push({
      field: 'ambitoTerritorial',
      message: 'Seleccione un ámbito territorial.',
    })
  }

  if (!pais) {
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
  return issues.map((issue) => issue.message).join(' ')
}
