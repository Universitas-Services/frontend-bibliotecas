export interface CarpetaInterna {
  id: string
  nombreCarpeta: string
  slug: string
  gcsUri?: string
  createdAt?: string
  updatedAt?: string
  /** Hijos embebidos en la respuesta del backend (si vienen incluidos). */
  children?: CarpetaInterna[]
}

export interface Subcarpeta {
  id: string
  tipoNorma: string
  slug: string
  gcsUri?: string
  createdAt?: string
  updatedAt?: string
  carpetasInternas?: CarpetaInterna[]
}

export interface TemaPrincipal {
  id: string
  nombre: string
  slug: string
  gcsUri?: string
  createdAt?: string
  updatedAt?: string
  subcarpetas?: Subcarpeta[]
}

type TipoNormaDisplaySource = {
  nombreCarpeta?: string | null
  nombre?: string | null
  nombreInstrumento?: string | null
  titulo?: string | null
}

/** El backend puede devolver el nombre en distintos campos según el endpoint. */
export function getTipoNormaDisplayName(item: TipoNormaDisplaySource): string {
  const candidates = [item.nombreCarpeta, item.nombre, item.nombreInstrumento, item.titulo]

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  return ''
}

const CARPETA_LIST_KEYS = [
  'hijos',
  'children',
  'carpetasInternas',
  'carpetasHijas',
  'data',
  'content',
  'items',
  'results',
  'payload',
  'records',
  'rows',
]

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function toCarpetaRecords(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return []
  return value.filter(isRecord)
}

function extractEmbeddedChildren(item: Record<string, unknown>): Record<string, unknown>[] {
  for (const key of ['hijos', 'children', 'carpetasInternas', 'carpetasHijas']) {
    const value = item[key]
    if (Array.isArray(value) && value.length > 0) {
      return toCarpetaRecords(value)
    }
  }
  return []
}

/** Normaliza listados de carpetas: array plano o envoltorios comunes del backend. */
export function normalizeCarpetasList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) {
    return toCarpetaRecords(data)
  }

  if (!isRecord(data)) {
    return []
  }

  for (const key of CARPETA_LIST_KEYS) {
    const value = data[key]
    if (Array.isArray(value)) {
      const items = toCarpetaRecords(value)
      if (items.length > 0) return items
    }
    if (isRecord(value)) {
      const nested = normalizeCarpetasList(value)
      if (nested.length > 0) return nested
    }
  }

  return []
}

function getCarpetaId(item: Record<string, unknown>): string {
  const candidates = [item.id, item._id, item.carpetaInternaId, item.uuid]
  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) return value.trim()
    if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  }
  return ''
}

export function mapCarpetasFromApi(data: unknown): CarpetaInterna[] {
  return normalizeCarpetasList(data)
    .map(normalizeCarpetaInterna)
    .filter((item) => item.id)
}

export function normalizeCarpetaInterna(item: Record<string, unknown>): CarpetaInterna {
  const embeddedChildren = extractEmbeddedChildren(item)
  const children =
    embeddedChildren.length > 0
      ? embeddedChildren.map(normalizeCarpetaInterna).filter((child) => child.id)
      : undefined

  return {
    id: getCarpetaId(item),
    nombreCarpeta: getTipoNormaDisplayName(item),
    slug: String(item.slug || ''),
    gcsUri: typeof item.gcsUri === 'string' ? item.gcsUri : undefined,
    createdAt: typeof item.createdAt === 'string' ? item.createdAt : undefined,
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
    children: children && children.length > 0 ? children : undefined,
  }
}
