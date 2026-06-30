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

/** Flujo CMS: BORRADOR | PENDIENTE_REVISION | PUBLICADO */
export function mapBackendStatus(estado: string): DocumentStatus {
  const normalized = estado.toUpperCase().replace(/\s+/g, '_')

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

  return 'borrador'
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
