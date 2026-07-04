/** Extrae etiquetas de GET /documentos/:id (campo etiquetas). */
export function extractDocumentEtiquetas(
  doc: Record<string, unknown> | null | undefined,
): string[] {
  if (!doc) return []
  return readStringArray(doc.etiquetas)
}

/** Extrae palabras clave de GET /documentos/:id (campo keywords). */
export function extractDocumentKeywords(doc: Record<string, unknown> | null | undefined): string[] {
  if (!doc) return []
  return readStringArray(doc.keywords)
}

function readStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map(String)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value) as unknown
      if (Array.isArray(parsed)) {
        return parsed
          .map(String)
          .map((item) => item.trim())
          .filter(Boolean)
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
