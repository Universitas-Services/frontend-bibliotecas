export type DocumentStatus = 'publicado' | 'en-revision' | 'borrador'

export type DocumentFilterId = 'todos' | 'publicados' | 'en-revision' | 'borradores'

export const DOCUMENT_FILTER_TABS: {
  id: DocumentFilterId
  label: string
}[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'publicados', label: 'Publicados' },
  { id: 'en-revision', label: 'En Revisión' },
  { id: 'borradores', label: 'Borradores' },
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
}

export function mapBackendStatus(estado: string): DocumentStatus {
  const normalized = estado.toLowerCase()

  if (normalized.includes('publicado') || normalized.includes('aprobado')) {
    return 'publicado'
  }
  if (normalized.includes('borrador')) {
    return 'borrador'
  }
  if (normalized.includes('revision') || normalized.includes('revisión')) {
    return 'en-revision'
  }

  return 'borrador'
}
