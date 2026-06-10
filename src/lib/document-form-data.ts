export type DocumentClassificationFields = {
  temaPrincipalNombre?: string
  tipoNormaNombre?: string
}

type BuildDocumentMultipartOptions = {
  outbound: FormData
  categorias: FormDataEntryValue[]
  classification: DocumentClassificationFields
  file?: File | null
}

/** Payload multipart compartido por upload y borrador (mismos campos que aceptará el API). */
export function buildDocumentMultipartPayload({
  outbound,
  categorias,
  classification,
  file,
}: BuildDocumentMultipartOptions): FormData {
  const formData = new FormData()

  if (file) {
    formData.set('file', file, file.name)
  }

  formData.set('titulo', (outbound.get('titulo') as string) || '')
  formData.set('tituloIntegro', (outbound.get('tituloIntegro') as string) || '')
  formData.set('nombreBreve', (outbound.get('nombreBreve') as string) || '')
  formData.set(
    'temaPrincipal',
    classification.temaPrincipalNombre || (outbound.get('temaPrincipal') as string) || '',
  )
  formData.set(
    'tipoNorma',
    classification.tipoNormaNombre || (outbound.get('tipoNorma') as string) || '',
  )
  formData.set('enteEmisor', (outbound.get('enteEmisor') as string) || '')
  formData.set('fechaPublicacion', (outbound.get('fechaPublicacion') as string) || '')

  const categoriaIds = categorias.filter((cat) => cat).map(String)
  if (categoriaIds.length > 0) {
    formData.set('categoriaIds', categoriaIds.join(','))
  }

  return formData
}
