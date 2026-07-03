import { mapFilterTabToBackendEstado, type DocumentFilterId } from '@/lib/document-status'

export type AdminListQuery = {
  estado?: DocumentFilterId
  curadorId?: string
  conNotas?: boolean
  page?: number
  limit?: number
}

/** Mapea tabs del admin al enum del backend (`TODOS` explícito cuando aplica). */
export function mapAdminFilterToBackendEstado(tab?: DocumentFilterId): string {
  if (!tab || tab === 'todos') return 'TODOS'
  return mapFilterTabToBackendEstado(tab) ?? 'TODOS'
}

export function buildAdminListPath(filters: AdminListQuery = {}): string {
  const page = filters.page ?? 1
  const limit = filters.limit ?? 10
  const params = new URLSearchParams()

  params.set('page', String(page))
  params.set('limit', String(limit))
  params.set('estado', mapAdminFilterToBackendEstado(filters.estado))

  if (filters.curadorId) params.set('curadorId', filters.curadorId)
  if (filters.conNotas) params.set('conNotas', 'true')

  return `/documentos/admin/list?${params.toString()}`
}
