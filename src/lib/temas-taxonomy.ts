export interface CarpetaInterna {
  id: string
  nombreCarpeta: string
  slug: string
  gcsUri?: string
  createdAt?: string
  updatedAt?: string
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

export function normalizeCarpetaInterna(item: Record<string, unknown>): CarpetaInterna {
  return {
    id: String(item.id || item._id || ''),
    nombreCarpeta: getTipoNormaDisplayName(item),
    slug: String(item.slug || ''),
    gcsUri: typeof item.gcsUri === 'string' ? item.gcsUri : undefined,
    createdAt: typeof item.createdAt === 'string' ? item.createdAt : undefined,
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
  }
}
