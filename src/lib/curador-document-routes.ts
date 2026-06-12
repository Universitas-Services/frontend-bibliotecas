/** Previsualización del documento (ficha + PDF). Si hay notas del admin, incluye correcciones. */
export function getCuradorDocumentViewHref(documentId: string, tieneNotas = false): string {
  if (tieneNotas) {
    return `/curador/correcciones/${documentId}`
  }
  return `/curador/gestion-documental/${documentId}`
}

export function getCuradorDocumentEditHref(documentId: string): string {
  return `/curador/nueva-carga?edit=${documentId}`
}
