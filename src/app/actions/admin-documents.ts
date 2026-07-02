'use server'

import { revalidatePath } from 'next/cache'

import {
  apiDelete,
  apiGet,
  apiPost,
  normalizeDocumentsList,
  type ApiErrorCode,
} from '@/lib/api-client'
import { USER_MSG } from '@/lib/user-messages'

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

export type AprobarDocumentoPayload = {
  /** Si es true, envía matrizAId/matrizBIds para sobrescribir la propuesta del curador. */
  overrideMatrices?: boolean
  matrizAId?: string | null
  matrizBIds?: string[]
}

export async function aprobarDocumentoAction(id: string, payload: AprobarDocumentoPayload = {}) {
  const body: Record<string, unknown> = {}

  if (payload.overrideMatrices) {
    body.matrizAId = payload.matrizAId ?? null
    body.matrizBIds = payload.matrizBIds ?? []
  }

  const result = await apiPost(`/workflows/publicar/${id}`, body)

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

export type RechazarDocumentoPayload = {
  motivo: string
}

export async function rechazarDocumentoAction(id: string, payload: RechazarDocumentoPayload) {
  const motivo = payload.motivo.trim()

  if (!motivo) {
    return {
      success: false as const,
      error: 'Debe indicar el motivo del rechazo.',
      status: 400,
      code: 'HTTP_ERROR' as const,
    }
  }

  const result = await apiPost(`/workflows/rechazar/${id}`, { motivo })

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

export type HardDeleteDocumentResult =
  | { success: true; message: string }
  | { success: false; error: string; status?: number; code?: ApiErrorCode }

export async function hardDeleteDocumentAction(
  documentId: string,
): Promise<HardDeleteDocumentResult> {
  const id = documentId.trim()

  if (!id) {
    return {
      success: false,
      error: 'El identificador del documento no es válido.',
      status: 400,
      code: 'HTTP_ERROR',
    }
  }

  const result = await apiDelete(`/documentos/admin/${encodeURIComponent(id)}/hard-delete`)

  if (!result.success) {
    if (result.status === 403) {
      return {
        success: false,
        error: USER_MSG.error.hardDeleteForbidden,
        status: result.status,
        code: result.code,
      }
    }

    if (result.status === 404) {
      return {
        success: false,
        error: 'El documento ya no existe o el identificador no es válido.',
        status: result.status,
        code: result.code,
      }
    }

    return {
      success: false,
      error: result.error || USER_MSG.error.hardDeleteDocument,
      status: result.status,
      code: result.code,
    }
  }

  revalidatePath('/admin/gestion-documental')

  const data = result.data
  const message =
    data &&
    typeof data === 'object' &&
    typeof (data as Record<string, unknown>).message === 'string'
      ? String((data as Record<string, unknown>).message)
      : USER_MSG.success.documentHardDeleted

  return { success: true, message }
}
