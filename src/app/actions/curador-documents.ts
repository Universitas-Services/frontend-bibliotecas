'use server'

import {
  apiGet,
  apiPatch,
  apiPostFormData,
  normalizeDocumentsList,
  type ApiErrorCode,
} from '@/lib/api-client'
import { buildCuradorListPath } from '@/lib/curador-list-query'
import type { DocumentFilterId } from '@/lib/document-status'

export type CuradorDocumentsFilters = {
  estado?: DocumentFilterId
  busqueda?: string
  tiempo?: string
  page?: number
  limit?: number
}

export type PaginatedDocuments = {
  documents: Record<string, unknown>[]
  total: number
  page: number
  limit: number
  totalPages: number
}

function normalizePaginatedResponse(
  data: unknown,
  fallbackPage: number,
  fallbackLimit: number,
): PaginatedDocuments {
  const documents = normalizeDocumentsList(data)

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>
    const total =
      typeof record.total === 'number'
        ? record.total
        : typeof record.totalElements === 'number'
          ? record.totalElements
          : typeof record.count === 'number'
            ? record.count
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
    const totalPages =
      typeof record.totalPages === 'number'
        ? record.totalPages
        : Math.max(1, Math.ceil(total / Math.max(limit, 1)))

    return {
      documents,
      total,
      page,
      limit,
      totalPages,
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

export type GetCuradorDocumentsResult =
  | { success: true; data: PaginatedDocuments; status: number }
  | { success: false; error: string; details?: string; status?: number; code?: ApiErrorCode }

export async function getCuradorDocumentsAction(
  filters: CuradorDocumentsFilters = {},
): Promise<GetCuradorDocumentsResult> {
  const page = filters.page ?? 1
  const limit = filters.limit ?? 10
  const path = buildCuradorListPath({ ...filters, page, limit })
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

  return {
    success: true,
    data: normalizePaginatedResponse(result.data, page, limit),
    status: result.status,
  }
}

export async function uploadBorradorAction(formData: FormData) {
  const result = await apiPostFormData('/documentos/borrador', formData)

  if (!result.success) {
    return {
      error: result.error,
      details: result.details,
      status: result.status,
      code: result.code,
    }
  }

  return { success: true, data: result.data }
}

export type PublicarBorradorPayload = {
  subcarpetaNormaId: string
  carpetaInternaId?: string
  categoriaIds: string[]
}

export async function publicarBorradorAction(id: string, payload: PublicarBorradorPayload) {
  const result = await apiPatch(`/documentos/borrador/${id}/publicar`, {
    subcarpetaNormaId: payload.subcarpetaNormaId.trim(),
    ...(payload.carpetaInternaId && { carpetaInternaId: payload.carpetaInternaId.trim() }),
    categoriaIds: payload.categoriaIds.map((categoriaId) => categoriaId.trim()).filter(Boolean),
  })

  if (!result.success) {
    return {
      success: false as const,
      error: result.error,
      details: result.details,
      status: result.status,
      code: result.code,
    }
  }

  return { success: true as const, data: result.data }
}
