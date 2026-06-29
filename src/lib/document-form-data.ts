import { parseMatrizBIdsFromForm } from '@/lib/document-matrices'

export type DocumentClassificationFields = {
  temaPrincipalId?: string
  temaPrincipalNombre?: string
  tipoDocumentoId?: string
  tipoDocumentoNombre?: string
  carpetaInternaId?: string
  carpetaPathNames?: string[]
}

type BuildDocumentMultipartOptions = {
  outbound: FormData
  categorias: FormDataEntryValue[]
  classification: DocumentClassificationFields
  file?: File | null
  gacetaFile?: File | null
  metadatos?: Record<string, unknown>
}

function parseStringArrayValue(raw: string): string[] {
  const trimmed = raw.trim()
  if (!trimmed) return []

  try {
    const parsed = JSON.parse(trimmed) as unknown
    if (Array.isArray(parsed)) {
      return parsed.map(String).filter((item) => item.trim())
    }
  } catch {
    // fallback below
  }

  return trimmed
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function readStringArray(formData: FormData, key: string): string[] {
  const values = formData.getAll(key).filter((entry) => String(entry).trim())
  if (values.length === 0) return []

  return values.flatMap((entry) => parseStringArrayValue(String(entry)))
}

/** Payload multipart compartido por upload, borrador y edición. */
export function buildDocumentMultipartPayload({
  outbound,
  categorias,
  classification,
  file,
  gacetaFile,
  metadatos,
}: BuildDocumentMultipartOptions): FormData {
  const formData = new FormData()

  if (file) {
    formData.set('file', file, file.name)
  }

  if (gacetaFile) {
    formData.set('gacetaFile', gacetaFile, gacetaFile.name)
  }

  formData.set('titulo', (outbound.get('titulo') as string) || '')
  formData.set('tituloIntegro', (outbound.get('tituloIntegro') as string) || '')
  formData.set('nombreBreve', (outbound.get('nombreBreve') as string) || '')

  const subcarpetaNormaId = classification.tipoDocumentoId?.trim() || ''
  const carpetaInternaId = classification.carpetaInternaId?.trim() || ''

  if (subcarpetaNormaId) {
    formData.set('subcarpetaNormaId', subcarpetaNormaId)
  }
  if (carpetaInternaId) {
    formData.set('carpetaInternaId', carpetaInternaId)
  }

  const resumen = (outbound.get('resumen') as string) || ''
  if (resumen) {
    formData.set('resumen', resumen)
  }

  const pais = (outbound.get('pais') as string) || ''
  if (pais) {
    formData.set('pais', pais)
  }

  const ocrHabilitado = outbound.get('ocrHabilitado')
  formData.set(
    'ocrHabilitado',
    ocrHabilitado === 'true' || ocrHabilitado === 'on' ? 'true' : 'false',
  )

  const jerarquiaSuperiorId = (outbound.get('jerarquiaSuperiorId') as string) || ''
  if (jerarquiaSuperiorId) {
    formData.set('jerarquiaSuperiorId', jerarquiaSuperiorId)
  }

  const documentoRelacionadoId = (outbound.get('documentoRelacionadoId') as string) || ''
  if (documentoRelacionadoId) {
    formData.set('documentoRelacionadoId', documentoRelacionadoId)
  }

  const etiquetas = readStringArray(outbound, 'etiquetas')
  if (etiquetas.length > 0) {
    formData.set('etiquetas', JSON.stringify(etiquetas))
  }

  const matrizAId = (outbound.get('matrizAId') as string) || ''
  if (matrizAId) formData.set('matrizAId', matrizAId)

  const matrizBIds = parseMatrizBIdsFromForm(outbound)
  if (matrizBIds.length > 0) {
    formData.set('matrizBIds', matrizBIds.join(','))
  }

  const leyViejaId = (outbound.get('leyViejaId') as string) || ''
  if (leyViejaId) formData.set('leyViejaId', leyViejaId)

  const categoriaIds = categorias.filter((cat) => cat).map(String)
  if (categoriaIds.length > 0) {
    formData.set('categoriaIds', JSON.stringify(categoriaIds))
  }

  if (metadatos && Object.keys(metadatos).length > 0) {
    formData.set('metadatos', JSON.stringify(metadatos))
  }

  return formData
}
