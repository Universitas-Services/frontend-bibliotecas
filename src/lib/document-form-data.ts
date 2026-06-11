import { parseMatrizBIdsFromForm } from '@/lib/document-matrices'

export type DocumentClassificationFields = {
  temaPrincipalNombre?: string
  tipoNormaNombre?: string
}

const VALID_ESTADO_LEGAL = new Set(['VIGENTE', 'REFORMADA', 'DEROGADA'])

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

  const resumen = (outbound.get('resumen') as string) || ''
  if (resumen) {
    formData.set('resumen', resumen)
  }

  const keywords = outbound
    .getAll('keywords')
    .filter((keyword) => keyword)
    .map(String)
  if (keywords.length > 0) {
    formData.set('keywords', keywords.join(','))
  }

  const soloLecturaImagen = outbound.get('soloLecturaImagen')
  if (soloLecturaImagen === 'true' || soloLecturaImagen === 'on') {
    formData.set('soloLecturaImagen', 'true')
  }

  const matrizAId = (outbound.get('matrizAId') as string) || ''
  if (matrizAId) formData.set('matrizAId', matrizAId)

  const matrizBIds = parseMatrizBIdsFromForm(outbound)
  if (matrizBIds.length > 0) {
    formData.set('matrizBIds', matrizBIds.join(','))
  }

  const estadoLegal = String(outbound.get('estadoLegal') ?? '')
    .trim()
    .toUpperCase()
  if (VALID_ESTADO_LEGAL.has(estadoLegal)) {
    formData.set('estadoLegal', estadoLegal)
  }

  const leyViejaId = (outbound.get('leyViejaId') as string) || ''
  if (leyViejaId) formData.set('leyViejaId', leyViejaId)

  const categoriaIds = categorias.filter((cat) => cat).map(String)
  if (categoriaIds.length > 0) {
    formData.set('categoriaIds', categoriaIds.join(','))
  }

  return formData
}
