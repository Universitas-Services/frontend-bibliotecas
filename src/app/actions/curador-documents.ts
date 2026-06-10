'use server'

import {
  apiGet,
  apiPatch,
  apiPostFormData,
  mergeDocumentsById,
  normalizeDocumentsList,
  type ApiErrorCode,
} from '@/lib/api-client'
import { mapBackendStatus, type DocumentFilterId } from '@/lib/document-status'

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

export type GetCuradorDocumentsResult =
  | { success: true; data: PaginatedDocuments; status: number }
  | { success: false; error: string; details?: string; status?: number; code?: ApiErrorCode }

async function fetchCuradorDocumentsRaw(): Promise<
  | { success: true; data: unknown; status: number }
  | { success: false; error: string; details?: string; status?: number; code?: ApiErrorCode }
> {
  const [curadorResult, generalResult] = await Promise.all([
    apiGet('/documentos/curador/list'),
    apiGet('/documentos'),
  ])

  const curadorDocs = curadorResult.success ? normalizeDocumentsList(curadorResult.data) : []
  const generalDocs = generalResult.success ? normalizeDocumentsList(generalResult.data) : []
  const mergedDocs = mergeDocumentsById(curadorDocs, generalDocs)

  if (process.env.NODE_ENV === 'development') {
    console.info('[curador docs]', {
      curadorList: curadorDocs.length,
      documentos: generalDocs.length,
      merged: mergedDocs.length,
    })
  }

  if (mergedDocs.length > 0) {
    const status = curadorResult.success
      ? curadorResult.status
      : generalResult.success
        ? generalResult.status
        : 200

    return { success: true, data: mergedDocs, status }
  }

  if (curadorResult.success) {
    return { success: true, data: curadorResult.data, status: curadorResult.status }
  }

  if (generalResult.success) {
    return { success: true, data: generalResult.data, status: generalResult.status }
  }

  return {
    success: false,
    error: curadorResult.error || generalResult.error || 'Error al cargar documentos',
    details: curadorResult.details || generalResult.details,
    status: curadorResult.status || generalResult.status,
    code: curadorResult.code || generalResult.code,
  }
}

function filterByEstadoTab(
  documents: Record<string, unknown>[],
  estado?: DocumentFilterId,
): Record<string, unknown>[] {
  if (!estado || estado === 'todos') return documents

  return documents.filter((doc) => {
    const backendEstado = typeof doc.estado === 'string' ? doc.estado : ''
    const status = mapBackendStatus(backendEstado)

    switch (estado) {
      case 'publicados':
        return status === 'publicado'
      case 'en-revision':
        return status === 'en-revision'
      case 'borradores':
        return status === 'borrador'
      default:
        return true
    }
  })
}

function filterByBusqueda(
  documents: Record<string, unknown>[],
  busqueda?: string,
): Record<string, unknown>[] {
  const term = busqueda?.trim().toLowerCase()
  if (!term) return documents

  return documents.filter((doc) => {
    const titulo = String(doc.titulo || doc.tituloIntegro || '').toLowerCase()
    const nombreBreve = String(doc.nombreBreve || '').toLowerCase()
    return titulo.includes(term) || nombreBreve.includes(term)
  })
}

function getDocumentDate(doc: Record<string, unknown>): Date | null {
  const raw =
    (typeof doc.ultimaActualizacion === 'string' && doc.ultimaActualizacion) ||
    (typeof doc.updatedAt === 'string' && doc.updatedAt) ||
    (typeof doc.createdAt === 'string' && doc.createdAt) ||
    null

  if (!raw) return null
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? null : date
}

function filterByTiempo(
  documents: Record<string, unknown>[],
  tiempo?: string,
): Record<string, unknown>[] {
  const days = tiempo === '7d' ? 7 : tiempo === '90d' ? 90 : 30
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  return documents.filter((doc) => {
    const date = getDocumentDate(doc)
    return date ? date >= cutoff : true
  })
}

function sortDocumentsByDateDesc(documents: Record<string, unknown>[]): Record<string, unknown>[] {
  return [...documents].sort((left, right) => {
    const leftTime = getDocumentDate(left)?.getTime() ?? 0
    const rightTime = getDocumentDate(right)?.getTime() ?? 0
    return rightTime - leftTime
  })
}

export async function getCuradorDocumentsAction(
  filters: CuradorDocumentsFilters = {},
): Promise<GetCuradorDocumentsResult> {
  const page = filters.page ?? 1
  const limit = filters.limit ?? 10

  const result = await fetchCuradorDocumentsRaw()

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      details: result.details,
      status: result.status,
      code: result.code,
    }
  }

  const allData = normalizePaginatedResponse(result.data, page, limit)
  let documents = allData.documents

  documents = filterByEstadoTab(documents, filters.estado)
  documents = filterByBusqueda(documents, filters.busqueda)
  documents = filterByTiempo(documents, filters.tiempo)
  documents = sortDocumentsByDateDesc(documents)

  const start = (page - 1) * limit
  const paginatedDocuments = documents.slice(start, start + limit)

  return {
    success: true,
    data: {
      documents: paginatedDocuments,
      total: documents.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(documents.length / limit)),
    },
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
  comentarios?: string
}

export async function publicarBorradorAction(id: string, payload: PublicarBorradorPayload) {
  const body: Record<string, string> = {}
  if (payload.comentarios?.trim()) {
    body.comentarios = payload.comentarios.trim()
  }

  const result = await apiPatch(`/documentos/borrador/${id}/publicar`, body)

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
