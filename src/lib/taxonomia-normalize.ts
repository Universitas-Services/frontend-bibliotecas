import type {
  CategoriaItem,
  EtiquetaItem,
  EstadoAprobacion,
  SugerenciaPendiente,
} from '@/lib/types/taxonomia'

export function normalizeTaxonomiaList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) {
    return data.filter(
      (item): item is Record<string, unknown> => !!item && typeof item === 'object',
    )
  }

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>
    for (const key of ['data', 'items', 'content']) {
      const value = record[key]
      if (Array.isArray(value)) {
        return value.filter(
          (item): item is Record<string, unknown> => !!item && typeof item === 'object',
        )
      }
    }
  }

  return []
}

function readEstado(value: unknown): EstadoAprobacion | undefined {
  if (typeof value !== 'string') return undefined
  const normalized = value.toUpperCase()
  if (normalized === 'APROBADA' || normalized === 'SUGERIDA' || normalized === 'RECHAZADA') {
    return normalized
  }
  return undefined
}

export function normalizeEtiquetaItem(raw: Record<string, unknown>): EtiquetaItem {
  return {
    id: String(raw.id || raw._id || ''),
    nombre: String(raw.nombre || ''),
    estado: readEstado(raw.estado) ?? 'APROBADA',
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : undefined,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : undefined,
    sugeridoPorId:
      typeof raw.sugeridoPorId === 'string' || typeof raw.sugeridoPorId === 'number'
        ? String(raw.sugeridoPorId)
        : null,
  }
}

export function normalizeCategoriaItem(raw: Record<string, unknown>): CategoriaItem {
  return {
    id: String(raw.id || raw._id || ''),
    nombre: String(raw.nombre || ''),
    descripcion: typeof raw.descripcion === 'string' ? raw.descripcion : undefined,
    estado: readEstado(raw.estado),
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : undefined,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : undefined,
    sugeridoPorId:
      typeof raw.sugeridoPorId === 'string' || typeof raw.sugeridoPorId === 'number'
        ? String(raw.sugeridoPorId)
        : null,
  }
}

export function normalizeSugerenciaPendiente(raw: Record<string, unknown>): SugerenciaPendiente {
  const sugeridoPorRaw = raw.sugeridoPor
  const sugeridoPor =
    sugeridoPorRaw && typeof sugeridoPorRaw === 'object' && !Array.isArray(sugeridoPorRaw)
      ? {
          id: String((sugeridoPorRaw as Record<string, unknown>).id || ''),
          email: String((sugeridoPorRaw as Record<string, unknown>).email || ''),
          role: String((sugeridoPorRaw as Record<string, unknown>).role || ''),
        }
      : null

  return {
    id: String(raw.id || raw._id || ''),
    nombre: String(raw.nombre || ''),
    estado: readEstado(raw.estado) ?? 'SUGERIDA',
    sugeridoPorId:
      typeof raw.sugeridoPorId === 'string' || typeof raw.sugeridoPorId === 'number'
        ? String(raw.sugeridoPorId)
        : null,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : undefined,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : undefined,
    sugeridoPor,
  }
}

export function getEstadoAprobacionLabel(estado?: EstadoAprobacion): string {
  switch (estado) {
    case 'APROBADA':
      return 'Aprobada'
    case 'SUGERIDA':
      return 'Sugerida'
    case 'RECHAZADA':
      return 'Rechazada'
    default:
      return '—'
  }
}
