export type MatrizARef = {
  id: string
  nombre: string
}

export type MatrizBRef = {
  id: string
  titulo: string
}

export type DocumentMatrices = {
  matrizAId?: string
  matrizA: MatrizARef | null
  matrizBIds: string[]
  matrizB: MatrizBRef[]
}

function readId(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (typeof value === 'number') return String(value)
  return undefined
}

function readMatrizARef(value: unknown): MatrizARef | null {
  if (!value || typeof value !== 'object') return null

  const record = value as Record<string, unknown>
  const id = readId(record.id || record._id)
  if (!id) return null

  return {
    id,
    nombre: String(record.nombreProducto || record.nombre || 'Producto sin nombre'),
  }
}

function readMatrizBRef(value: unknown): MatrizBRef | null {
  if (!value || typeof value !== 'object') return null

  const record = value as Record<string, unknown>
  const id = readId(record.id || record._id)
  if (!id) return null

  return {
    id,
    titulo: String(
      record.tituloArticulo || record.titulo || record.nombre || 'Artículo sin título',
    ),
  }
}

/** Extrae matrices hidratadas de GET /documentos/:id */
export function extractDocumentMatrices(
  doc: Record<string, unknown> | null | undefined,
): DocumentMatrices {
  if (!doc) {
    return { matrizA: null, matrizBIds: [], matrizB: [] }
  }

  const matrizA = readMatrizARef(doc.matrizA)
  const matrizAId = readId(doc.matrizAId) || matrizA?.id

  const matrizBRaw = Array.isArray(doc.matrizB) ? doc.matrizB : []
  const matrizB = matrizBRaw.map(readMatrizBRef).filter((item): item is MatrizBRef => item !== null)
  const matrizBIds = matrizB.map((item) => item.id)

  return { matrizAId, matrizA, matrizBIds, matrizB }
}

export function parseMatrizBIdsFromForm(outbound: FormData): string[] {
  const repeated = outbound
    .getAll('matrizBIds')
    .filter((value) => value)
    .flatMap((value) => String(value).split(','))
    .map((id) => id.trim())
    .filter(Boolean)

  if (repeated.length > 0) {
    return [...new Set(repeated)]
  }

  const single = (outbound.get('matrizBIds') as string) || ''
  if (!single.trim()) return []

  return [
    ...new Set(
      single
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean),
    ),
  ]
}
