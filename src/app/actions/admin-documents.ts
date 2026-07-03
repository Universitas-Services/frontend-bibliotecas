'use server'

import { revalidatePath } from 'next/cache'

import {
  apiDelete,
  apiGet,
  apiPost,
  normalizeDocumentsList,
  type ApiErrorCode,
} from '@/lib/api-client'
import { buildAdminListPath } from '@/lib/admin-list-query'
import type { DocumentFilterId } from '@/lib/document-status'
import { USER_MSG } from '@/lib/user-messages'

export type AdminDocumentsFilters = {
  estado?: DocumentFilterId
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
  const countMeta = data._count as Record<string, unknown> | undefined

  let tema: string | undefined
  if (typeof data.tema === 'string' && data.tema.trim()) {
    tema = data.tema
  } else if (typeof data.temaPrincipal === 'string' && data.temaPrincipal.trim()) {
    tema = data.temaPrincipal
  } else if (Array.isArray(data.categorias)) {
    const nombres = data.categorias
      .map((item) =>
        item && typeof item === 'object'
          ? String((item as Record<string, unknown>).nombre || '').trim()
          : '',
      )
      .filter(Boolean)
    if (nombres.length > 0) tema = nombres.join(', ')
  }

  const subcarpeta = data.subcarpetaNorma as Record<string, unknown> | undefined
  const temaPrincipal = subcarpeta?.temaPrincipal as Record<string, unknown> | undefined
  if (!tema && temaPrincipal && typeof temaPrincipal.nombre === 'string') {
    tema = temaPrincipal.nombre
  }

  let ultimaNota: string | undefined
  if (typeof data.ultimaNota === 'string' && data.ultimaNota.trim()) {
    ultimaNota = data.ultimaNota
  } else if (typeof data.previewUltimaNota === 'string' && data.previewUltimaNota.trim()) {
    ultimaNota = data.previewUltimaNota
  } else if (Array.isArray(data.notasInternas) && data.notasInternas.length > 0) {
    const nota = data.notasInternas[0] as Record<string, unknown>
    for (const key of ['contenido', 'texto', 'mensaje', 'preview', 'descripcion']) {
      const value = nota[key]
      if (typeof value === 'string' && value.trim()) {
        ultimaNota = value.trim()
        break
      }
    }
  }

  const notasCount =
    typeof countMeta?.notasInternas === 'number'
      ? countMeta.notasInternas
      : typeof data.notasCount === 'number'
        ? data.notasCount
        : typeof data.numNotas === 'number'
          ? data.numNotas
          : Array.isArray(data.notasInternas)
            ? data.notasInternas.length
            : 0

  return {
    id: String(data.id || data._id || ''),
    titulo: String(data.titulo || data.tituloIntegro || 'Documento sin título'),
    curadorNombre: curador
      ? `${String(curador.nombre || '')} ${String(curador.apellido || '')}`.trim()
      : typeof data.curadorNombre === 'string'
        ? data.curadorNombre
        : undefined,
    curadorEmail: curador
      ? String(curador.email || '')
      : typeof data.curadorEmail === 'string'
        ? data.curadorEmail
        : undefined,
    tema,
    estado: String(data.estado || '—'),
    notasCount,
    ultimaNota,
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

export type GetAdminDocumentsResult =
  | { success: true; data: PaginatedAdminDocuments; status: number }
  | { success: false; error: string; details?: string; status?: number; code?: ApiErrorCode }

export async function getAdminDocumentsAction(
  filters: AdminDocumentsFilters = {},
): Promise<GetAdminDocumentsResult> {
  const page = filters.page ?? 1
  const limit = filters.limit ?? 10
  const path = buildAdminListPath({ ...filters, page, limit })
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
    data: normalizePaginatedAdminResponse(result.data, page, limit),
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
