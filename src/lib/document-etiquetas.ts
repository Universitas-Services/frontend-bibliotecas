function readStringField(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value.trim()
  return undefined
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    if (typeof value === 'string' && value.trim()) {
      try {
        const parsed = JSON.parse(value) as unknown
        if (Array.isArray(parsed)) {
          return parsed.map((item) => readStringFromItem(item)).filter(Boolean)
        }
      } catch {
        return value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      }
    }
    return []
  }

  return value.map((item) => readStringFromItem(item)).filter(Boolean)
}

function readStringFromItem(item: unknown): string {
  if (typeof item === 'string') return item.trim()
  if (item && typeof item === 'object' && !Array.isArray(item)) {
    const record = item as Record<string, unknown>
    return readStringField(record.nombre) || readStringField(record.name) || ''
  }
  return String(item).trim()
}

/** Extrae etiquetas del GET (strings u objetos { id, nombre }). */
export function extractDocumentEtiquetas(
  doc: Record<string, unknown> | null | undefined,
): string[] {
  if (!doc) return []
  return readStringArray(doc.etiquetas)
}

/** Extrae palabras clave del GET (`palabrasClave` o legacy `keywords`). */
export function extractDocumentKeywords(doc: Record<string, unknown> | null | undefined): string[] {
  if (!doc) return []
  const fromPalabrasClave = readStringArray(doc.palabrasClave)
  if (fromPalabrasClave.length > 0) return fromPalabrasClave
  return readStringArray(doc.keywords)
}
