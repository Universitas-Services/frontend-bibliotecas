'use server'

import { apiGet, normalizeDocumentsList, type ApiErrorCode } from '@/lib/api-client'

export type AdminDocumentsFilters = {
  curadorId?: string
  conNotas?: boolean
  page?: number
  limit?: number
}

export type AdminDocumentItem = {
  id: string
  titulo: string
  curadorNombre?: string
  curadorEmail?: string
  tema?: string
  estado: string
  notasCount: number
  ultimaNota?: string
}

export type PaginatedAdminDocuments = {
  documents: AdminDocumentItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

function normalizeAdminDocument(data: Record<string, unknown>): AdminDocumentItem {
  const curador = data.curador as Record<string, unknown> | undefined

  return {
    id: String(data.id || data._id || ''),
    titulo: String(data.titulo || data.tituloIntegro || 'Documento sin título'),
    curadorNombre: curador
      ? String(curador.nombre || `${curador.nombre || ''} ${curador.apellido || ''}`.trim())
      : typeof data.curadorNombre === 'string'
        ? data.curadorNombre
        : undefined,
    curadorEmail: curador
      ? String(curador.email || '')
      : typeof data.curadorEmail === 'string'
        ? data.curadorEmail
        : undefined,
    tema:
      typeof data.tema === 'string'
        ? data.tema
        : typeof data.temaPrincipal === 'string'
          ? data.temaPrincipal
          : undefined,
    estado: String(data.estado || '—'),
    notasCount:
      typeof data.notasCount === 'number'
        ? data.notasCount
        : typeof data.numNotas === 'number'
          ? data.numNotas
          : 0,
    ultimaNota:
      typeof data.ultimaNota === 'string'
        ? data.ultimaNota
        : typeof data.previewUltimaNota === 'string'
          ? data.previewUltimaNota
          : undefined,
  }
}

function normalizePaginatedAdminResponse(
  data: unknown,
  fallbackPage: number,
  fallbackLimit: number,
): PaginatedAdminDocuments {
  const rawDocuments = normalizeDocumentsList(data)
  const documents = rawDocuments.map(normalizeAdminDocument)

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>
    const total =
      typeof record.total === 'number'
        ? record.total
        : typeof record.totalElements === 'number'
          ? record.totalElements
          : documents.length
    const page =
      typeof record.page === 'number'
        ? record.page
        : typeof record.currentPage === 'number'
          ? record.currentPage
          : fallbackPage
    const limit =
      typeof record.limit === 'number'
        ? record.limit
        : typeof record.size === 'number'
          ? record.size
          : fallbackLimit

    return {
      documents,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    }
  }

  return {
    documents,
    total: documents.length,
    page: fallbackPage,
    limit: fallbackLimit,
    totalPages: 1,
  }
}

export type GetAdminDocumentsResult =
  | { success: true; data: PaginatedAdminDocuments; status: number }
  | { success: false; error: string; details?: string; status?: number; code?: ApiErrorCode }

export async function getAdminDocumentsAction(
  filters: AdminDocumentsFilters = {},
): Promise<GetAdminDocumentsResult> {
  const page = filters.page ?? 1
  const limit = filters.limit ?? 10
  const params = new URLSearchParams()

  if (filters.curadorId) params.set('curadorId', filters.curadorId)
  if (filters.conNotas) params.set('conNotas', 'true')

  const query = params.toString()
  const path = `/documentos/admin/list${query ? `?${query}` : ''}`
  const result = await apiGet(path)

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      details: result.details,
      status: result.status,
      code: result.code,
    }
  }

  const allData = normalizePaginatedAdminResponse(result.data, page, limit)
  const start = (page - 1) * limit
  const paginatedDocuments = allData.documents.slice(start, start + limit)

  return {
    success: true,
    data: {
      documents: paginatedDocuments,
      total: allData.documents.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(allData.documents.length / limit)),
    },
    status: result.status,
  }
}
