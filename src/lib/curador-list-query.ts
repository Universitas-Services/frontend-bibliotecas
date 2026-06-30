import {
  mapFilterTabToBackendEstado,
  mapTimeFilterToBackend,
  type DocumentFilterId,
} from '@/lib/document-status'

export type CuradorListQuery = {
  estado?: DocumentFilterId
  busqueda?: string
  tiempo?: string
  page?: number
  limit?: number
}

export function buildCuradorListPath(filters: CuradorListQuery = {}): string {
  const page = filters.page ?? 1
  const limit = filters.limit ?? 10
  const params = new URLSearchParams()

  params.set('page', String(page))
  params.set('limit', String(limit))

  const estado = mapFilterTabToBackendEstado(filters.estado)
  if (estado) params.set('estado', estado)

  const tiempo = mapTimeFilterToBackend(filters.tiempo)
  if (tiempo) params.set('tiempo', tiempo)

  const busqueda = filters.busqueda?.trim()
  if (busqueda) params.set('busqueda', busqueda)

  return `/documentos/curador/list?${params.toString()}`
}
