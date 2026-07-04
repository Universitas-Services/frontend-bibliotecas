import type { ClassificationValues } from '@/components/curador/nueva-carga/document-classification'
import { extractDocumentEtiquetas, extractDocumentKeywords } from '@/lib/document-etiquetas'
import { parseMetadatosObject } from '@/lib/metadata-schemas'

function readId(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return undefined
}

function readNestedRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

function readStringField(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value.trim()
  return undefined
}

export type DocumentEditClassification = Partial<ClassificationValues> & {
  subcarpetaNormaId?: string
  carpetaInternaId?: string
}

/** Mapea clasificación desde GET /documentos/:id (IDs sueltos + objetos anidados). */
export function extractDocumentEditClassification(
  doc: Record<string, unknown> | null | undefined,
): DocumentEditClassification {
  if (!doc) return {}

  const subcarpetaNorma = readNestedRecord(doc.subcarpetaNorma)
  const temaPrincipalNested = subcarpetaNorma
    ? readNestedRecord(subcarpetaNorma.temaPrincipal)
    : null

  const tipoDocumentoId = readId(doc.subcarpetaNormaId) || readId(subcarpetaNorma?.id) || undefined

  const temaPrincipalId = readId(temaPrincipalNested?.id) || undefined

  const temaPrincipalNombre =
    readStringField(doc.temaPrincipal) || readStringField(temaPrincipalNested?.nombre) || undefined

  const tipoDocumentoNombre =
    readStringField(doc.tipoNorma) ||
    readStringField(subcarpetaNorma?.nombre) ||
    readStringField(subcarpetaNorma?.tipoNorma) ||
    undefined

  const carpetaInterna = readNestedRecord(doc.carpetaInterna)
  const carpetaInternaId = readId(doc.carpetaInternaId) || readId(carpetaInterna?.id) || undefined

  return {
    temaPrincipalId,
    temaPrincipalNombre,
    tipoDocumentoId,
    tipoDocumentoNombre,
    carpetaInternaId,
    subcarpetaNormaId: tipoDocumentoId,
    carpetaPathNames: [],
  }
}

const ROOT_METADATA_KEYS = [
  'enteEmisor',
  'fechaPublicacion',
  'numeroGaceta',
  'numeroGacetaEstadal',
  'numeroGacetaMunicipal',
  'fechaPromulgacion',
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
  'municipio',
  'remitente',
  'tribunal',
  'numeroExpediente',
  'numeroSentencia',
  'fechaSentencia',
  'magistradoPonente',
  'juezPonente',
  'decision',
  'editorial',
  'isbn',
  'nombreRevista',
  'anioPublicacion',
]

/** Combina metadatos JSON con campos de primer nivel que el GET expone en la raíz. */
export function mergeDocumentMetadatosForEdit(
  doc: Record<string, unknown> | null | undefined,
): Record<string, string> {
  if (!doc) return {}

  const merged = parseMetadatosObject(doc.metadatos)

  for (const key of ROOT_METADATA_KEYS) {
    if (merged[key]) continue
    const value = doc[key]
    if (value === null || value === undefined) continue
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      merged[key] = String(value)
    }
  }

  return merged
}

export type DocumentEditSnapshot = {
  classification: DocumentEditClassification
  metadatos: Record<string, string>
  etiquetas: string[]
  keywords: string[]
}

export function extractDocumentEditSnapshot(
  doc: Record<string, unknown> | null | undefined,
): DocumentEditSnapshot {
  return {
    classification: extractDocumentEditClassification(doc),
    metadatos: mergeDocumentMetadatosForEdit(doc),
    etiquetas: extractDocumentEtiquetas(doc),
    keywords: extractDocumentKeywords(doc),
  }
}
