export type DocumentStatus = 'publicado' | 'en-revision' | 'borrador' | 'rechazado'

export type DocumentFilterId = 'todos' | 'publicados' | 'en-revision' | 'borradores' | 'rechazados'

export type LegalStatus = 'vigente' | 'reformada' | 'derogada' | 'sin-clasificar'

export const DOCUMENT_FILTER_TABS: {
  id: DocumentFilterId
  label: string
}[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'publicados', label: 'Publicados' },
  { id: 'en-revision', label: 'En Revisión' },
  { id: 'borradores', label: 'Borradores' },
  { id: 'rechazados', label: 'Rechazados' },
]

export const DOCUMENT_STATUS_STYLES: Record<
  DocumentStatus,
  {
    label: string
    badgeBg: string
    badgeText: string
    dotColor: string
    tableStatusColor: string
  }
> = {
  publicado: {
    label: 'Publicado',
    badgeBg: 'bg-[#DCFCE7]',
    badgeText: 'text-[#16A34A]',
    dotColor: 'bg-[#16A34A]',
    tableStatusColor: 'bg-[#DCFCE7] text-[#16A34A]',
  },
  'en-revision': {
    label: 'En Revisión',
    badgeBg: 'bg-[#D4E4FA]',
    badgeText: 'text-[#005496]',
    dotColor: 'bg-[#005496]',
    tableStatusColor: 'bg-[#D4E4FA] text-[#005496]',
  },
  borrador: {
    label: 'Borrador',
    badgeBg: 'bg-[#E5E7EB]',
    badgeText: 'text-[#404551]',
    dotColor: 'bg-[#404551]',
    tableStatusColor: 'bg-[#E5E7EB] text-[#404551]',
  },
  rechazado: {
    label: 'Rechazado',
    badgeBg: 'bg-[#FEE2E2]',
    badgeText: 'text-[#DC2626]',
    dotColor: 'bg-[#DC2626]',
    tableStatusColor: 'bg-[#FEE2E2] text-[#DC2626]',
  },
}

export const ESTADO_LEGAL_OPTIONS = [
  { value: 'VIGENTE', label: 'Vigente' },
  { value: 'REFORMADA', label: 'Reformada' },
  { value: 'DEROGADA', label: 'Derogada' },
] as const

export type BackendEstadoLegal = (typeof ESTADO_LEGAL_OPTIONS)[number]['value']

export const LEGAL_STATUS_STYLES: Record<
  LegalStatus,
  {
    label: string
    badgeBg: string
    badgeText: string
  }
> = {
  vigente: {
    label: 'Vigente',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
  },
  reformada: {
    label: 'Reformada',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
  },
  derogada: {
    label: 'Derogada',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
  },
  'sin-clasificar': {
    label: 'Sin clasificar',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-600',
  },
}

/** Normaliza un valor de estado del workflow CMS. */
export function normalizeWorkflowEstado(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, '_')
}

/** Indica si el valor corresponde al enum de workflow (no geografía). */
export function isWorkflowEstado(raw: string): boolean {
  const normalized = normalizeWorkflowEstado(raw)
  if (!normalized) return false

  return (
    normalized === 'PUBLICADO' ||
    normalized.includes('PUBLICADO') ||
    normalized === 'BORRADOR' ||
    normalized.includes('BORRADOR') ||
    normalized === 'PENDIENTE_REVISION' ||
    normalized.includes('PENDIENTE') ||
    normalized.includes('REVISION') ||
    normalized === 'RECHAZADO' ||
    normalized.includes('RECHAZADO')
  )
}

function readMetadatosRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

/**
 * Resuelve el estado del workflow desde un documento GET.
 * Mitiga la colisión backend metadatos.estado → doc.estado (ej. "Lara").
 */
export function resolveDocumentWorkflowEstado(
  doc: Record<string, unknown> | null | undefined,
): string {
  if (!doc) return ''

  const candidates = [doc.estado, doc.estadoDocumento, doc.estadoWorkflow]

  for (const candidate of candidates) {
    const value = String(candidate ?? '').trim()
    if (value && isWorkflowEstado(value)) return value
  }

  const estado = String(doc.estado ?? '').trim()
  if (!estado) return ''

  const metadatos = readMetadatosRecord(doc.metadatos)
  const geo = String(metadatos.estadoGeografico ?? metadatos.estado ?? '').trim()
  if (geo && geo.toLowerCase() === estado.toLowerCase()) {
    return 'PENDIENTE_REVISION'
  }

  return estado
}

/** Flujo CMS: BORRADOR | PENDIENTE_REVISION | PUBLICADO */
export function mapBackendStatus(estado: string): DocumentStatus {
  const normalized = normalizeWorkflowEstado(estado)

  if (!normalized) return 'en-revision'

  if (normalized === 'PUBLICADO' || normalized.includes('PUBLICADO')) {
    return 'publicado'
  }

  if (normalized === 'BORRADOR' || normalized.includes('BORRADOR')) {
    return 'borrador'
  }

  if (
    normalized === 'PENDIENTE_REVISION' ||
    normalized.includes('PENDIENTE') ||
    normalized.includes('REVISION')
  ) {
    return 'en-revision'
  }

  if (normalized === 'RECHAZADO' || normalized.includes('RECHAZADO')) {
    return 'rechazado'
  }

  return 'en-revision'
}

export function mapDocumentStatus(doc: Record<string, unknown> | null | undefined): DocumentStatus {
  return mapBackendStatus(resolveDocumentWorkflowEstado(doc))
}

/** Validez jurídica: VIGENTE | REFORMADA | DEROGADA | null */
export function mapBackendLegalStatus(estadoLegal: string | null | undefined): LegalStatus {
  if (!estadoLegal || !estadoLegal.trim()) {
    return 'sin-clasificar'
  }

  const normalized = estadoLegal.toUpperCase().replace(/\s+/g, '_')

  if (normalized.includes('VIGENTE')) return 'vigente'
  if (normalized.includes('REFORMADA')) return 'reformada'
  if (normalized.includes('DEROGADA')) return 'derogada'

  return 'sin-clasificar'
}

/** Query param `estado` para GET /documentos/curador/list */
export function mapFilterTabToBackendEstado(tab?: DocumentFilterId): string | undefined {
  if (!tab || tab === 'todos') return undefined

  switch (tab) {
    case 'publicados':
      return 'PUBLICADOS'
    case 'en-revision':
      return 'EN_REVISION'
    case 'borradores':
      return 'BORRADORES'
    case 'rechazados':
      return 'RECHAZADOS'
    default:
      return undefined
  }
}

/** Query param `tiempo` para GET /documentos/curador/list */
export function mapTimeFilterToBackend(tiempo?: string): string | undefined {
  switch (tiempo) {
    case '7d':
      return '7_DIAS'
    case '30d':
      return '30_DIAS'
    case '90d':
      return '3_MESES'
    default:
      return undefined
  }
}
