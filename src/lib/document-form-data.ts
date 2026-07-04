import { parseMatrizBIdsFromForm } from '@/lib/document-matrices'

function isNonEmptyUploadFile(value: unknown): value is File {
  return value instanceof File && value.size > 0
}

/** Resuelve el archivo principal desde estado React o desde el FormData del formulario. */
export function resolvePrimaryUploadFile(
  selected: File | null | undefined,
  outbound: FormData,
): File | null {
  if (isNonEmptyUploadFile(selected)) return selected

  const fromForm = outbound.get('file')
  if (isNonEmptyUploadFile(fromForm)) return fromForm

  return null
}

/** Resuelve la gaceta opcional desde estado React o desde el FormData del formulario. */
export function resolveGacetaUploadFile(
  selected: File | null | undefined,
  outbound: FormData,
): File | null {
  if (isNonEmptyUploadFile(selected)) return selected

  const fromForm = outbound.get('gacetaFile')
  if (isNonEmptyUploadFile(fromForm)) return fromForm

  return null
}

export type UploadTopLevelFields = {
  enteEmisor: string
  fechaPublicacion: string
}

const ENTE_EMISOR_METADATA_KEYS = [
  'enteEmisor',
  'dependenciaAdministrativa',
  'organizacionInternacional',
  'organismoEmisor',
  'institucionResponsable',
  'nombreMedio',
  'autor',
  'ponente',
  'sala',
  'funcionarioFirmante',
  'ambitoGeografico',
  'estado',
  'municipio',
  'remitente',
]

const FECHA_PUBLICACION_METADATA_KEYS = [
  'fechaPublicacion',
  'fechaPromulgacion',
  'fechaSentencia',
  'fechaPresentacion',
  'fechaAdopcion',
  'ultimaActualizacion',
]

function readMetadataString(metadatos: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = metadatos[key]
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value)
    }
  }
  return ''
}

function readFechaPublicacionFromMetadatos(metadatos: Record<string, unknown>): string {
  const direct = readMetadataString(metadatos, FECHA_PUBLICACION_METADATA_KEYS)
  if (direct) return direct

  const anio = metadatos.anioPublicacion
  if (typeof anio === 'number' && anio >= 1000 && anio <= 9999) {
    return `${anio}-01-01`
  }
  if (typeof anio === 'string' && /^\d{4}$/.test(anio.trim())) {
    return `${anio.trim()}-01-01`
  }

  return ''
}

/** Campos de primer nivel exigidos por POST /documentos/upload y /documentos/borrador. */
export function extractUploadTopLevelFields(
  metadatos?: Record<string, unknown>,
): UploadTopLevelFields {
  const record = metadatos ?? {}
  return {
    enteEmisor: readMetadataString(record, ENTE_EMISOR_METADATA_KEYS),
    fechaPublicacion: readFechaPublicacionFromMetadatos(record),
  }
}

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

  const keywords = readStringArray(outbound, 'keywords')
  if (keywords.length > 0) {
    formData.set('keywords', JSON.stringify(keywords))
  }

  const matrizAId = (outbound.get('matrizAId') as string) || ''
  if (matrizAId) formData.set('matrizAId', matrizAId)

  const matrizBIds = parseMatrizBIdsFromForm(outbound)
  if (matrizBIds.length > 0) {
    formData.set('matrizBIds', matrizBIds.join(','))
  }

  const leyViejaId = (outbound.get('leyViejaId') as string) || ''
  if (leyViejaId) formData.set('leyViejaId', leyViejaId)

  const categoriaIds = categorias
    .filter((cat) => cat)
    .map(String)
    .map((id) => id.trim())
    .filter(Boolean)
  for (const categoriaId of categoriaIds) {
    formData.append('categoriaIds', categoriaId)
  }

  const topLevel = extractUploadTopLevelFields(metadatos)
  if (topLevel.enteEmisor) {
    formData.set('enteEmisor', topLevel.enteEmisor)
  }
  if (topLevel.fechaPublicacion) {
    formData.set('fechaPublicacion', topLevel.fechaPublicacion)
  }

  if (metadatos && Object.keys(metadatos).length > 0) {
    formData.set('metadatos', JSON.stringify(metadatos))
  }

  // Multer/Busboy: campos de texto primero, archivos al final.
  if (file) {
    formData.append('file', file, file.name)
  }

  if (gacetaFile) {
    formData.append('gacetaFile', gacetaFile, gacetaFile.name)
  }

  return formData
}
