export type DocumentCategoriaRef = {
  id: string
  nombre: string
}

function readId(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (typeof value === 'number') return String(value)
  return undefined
}

function readCategoriaRef(value: unknown): DocumentCategoriaRef | null {
  if (typeof value === 'string') {
    const id = readId(value)
    return id ? { id, nombre: 'Categoría asignada' } : null
  }

  if (!value || typeof value !== 'object') return null

  const record = value as Record<string, unknown>
  const id = readId(record.id || record._id || record.uuid)
  if (!id) return null

  const nombre = readId(record.nombre) || 'Categoría asignada'
  return { id, nombre }
}

/** Extrae categorías de GET /documentos/:id (categorias[] o categoriaIds[]) */
export function extractDocumentCategorias(
  doc: Record<string, unknown> | null | undefined,
): DocumentCategoriaRef[] {
  if (!doc) return []

  const fromObjects = Array.isArray(doc.categorias)
    ? doc.categorias
        .map(readCategoriaRef)
        .filter((item): item is DocumentCategoriaRef => item !== null)
    : []

  if (fromObjects.length > 0) {
    const seen = new Set<string>()
    return fromObjects.filter((cat) => {
      if (seen.has(cat.id)) return false
      seen.add(cat.id)
      return true
    })
  }

  const fromIds = Array.isArray(doc.categoriaIds)
    ? doc.categoriaIds
        .map(readCategoriaRef)
        .filter((item): item is DocumentCategoriaRef => item !== null)
    : []

  const seen = new Set<string>()
  return fromIds.filter((cat) => {
    if (seen.has(cat.id)) return false
    seen.add(cat.id)
    return true
  })
}

export function readCategoriaIdsFromDocument(doc: Record<string, unknown>): string[] {
  return extractDocumentCategorias(doc).map((cat) => cat.id)
}
