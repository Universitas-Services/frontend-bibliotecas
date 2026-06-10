'use server'

import {
  apiDelete,
  apiGet,
  apiPost,
  normalizeDocumentsList,
  type ApiErrorCode,
} from '@/lib/api-client'

export type NotaInterna = {
  id: string
  documentoId: string
  contenido: string
  autor?: string
  autorNombre?: string
  autorEmail?: string
  createdAt?: string
  fecha?: string
}

function normalizeNota(data: Record<string, unknown>): NotaInterna {
  const autor = data.autor as Record<string, unknown> | undefined

  return {
    id: String(data.id || data._id || ''),
    documentoId: String(data.documentoId || data.documento_id || ''),
    contenido: String(data.contenido || data.texto || ''),
    autor:
      typeof data.autor === 'string' ? data.autor : autor ? String(autor.nombre || '') : undefined,
    autorNombre:
      typeof data.autorNombre === 'string'
        ? data.autorNombre
        : autor
          ? String(autor.nombre || autor.name || '')
          : undefined,
    autorEmail:
      typeof data.autorEmail === 'string'
        ? data.autorEmail
        : autor
          ? String(autor.email || '')
          : undefined,
    createdAt:
      typeof data.createdAt === 'string'
        ? data.createdAt
        : typeof data.fecha === 'string'
          ? data.fecha
          : undefined,
    fecha: typeof data.fecha === 'string' ? data.fecha : undefined,
  }
}

function normalizeNotasList(data: unknown): NotaInterna[] {
  if (Array.isArray(data)) {
    return data
      .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
      .map(normalizeNota)
  }

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>
    for (const key of ['data', 'notas', 'items', 'content']) {
      const value = record[key]
      if (Array.isArray(value)) {
        return value
          .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
          .map(normalizeNota)
      }
    }
  }

  return []
}

export type DocumentoConNotas = {
  id: string
  titulo: string
  tema?: string
  notasCount: number
  ultimaNota?: string
  autorUltimaNota?: string
  fechaUltimaNota?: string
}

function normalizeDocumentoConNotas(data: Record<string, unknown>): DocumentoConNotas {
  const notas = Array.isArray(data.notas) ? data.notas : []
  const ultimaNotaRaw =
    notas.length > 0
      ? (notas[notas.length - 1] as Record<string, unknown>)
      : (data.ultimaNota as Record<string, unknown> | undefined)

  return {
    id: String(data.id || data._id || data.documentoId || ''),
    titulo: String(data.titulo || data.tituloIntegro || 'Documento sin título'),
    tema:
      typeof data.tema === 'string'
        ? data.tema
        : typeof data.temaPrincipal === 'string'
          ? data.temaPrincipal
          : undefined,
    notasCount:
      typeof data.notasCount === 'number'
        ? data.notasCount
        : typeof data.numNotas === 'number'
          ? data.numNotas
          : notas.length,
    ultimaNota: ultimaNotaRaw
      ? String(ultimaNotaRaw.texto || ultimaNotaRaw.contenido || data.previewUltimaNota || '')
      : typeof data.previewUltimaNota === 'string'
        ? data.previewUltimaNota
        : undefined,
    autorUltimaNota: ultimaNotaRaw
      ? String(
          (ultimaNotaRaw.autor as Record<string, unknown> | undefined)?.nombre ||
            ultimaNotaRaw.autorNombre ||
            data.autorUltimaNota ||
            '',
        )
      : typeof data.autorUltimaNota === 'string'
        ? data.autorUltimaNota
        : undefined,
    fechaUltimaNota: ultimaNotaRaw
      ? String(ultimaNotaRaw.createdAt || ultimaNotaRaw.fecha || data.fechaUltimaNota || '')
      : typeof data.fechaUltimaNota === 'string'
        ? data.fechaUltimaNota
        : undefined,
  }
}

type ActionError = {
  success: false
  error: string
  details?: string
  status?: number
  code?: ApiErrorCode
}

export async function getNotasByDocumentoAction(documentoId: string) {
  const result = await apiGet(`/notas-internas/documento/${encodeURIComponent(documentoId)}`)

  if (!result.success) {
    // Documento sin notas aún: el backend puede responder 404
    if (result.status === 404) {
      return { success: true as const, data: [] as NotaInterna[] }
    }

    return {
      success: false as const,
      error: result.error,
      details: result.details,
      status: result.status,
      code: result.code,
    }
  }

  return { success: true as const, data: normalizeNotasList(result.data) }
}

export async function createNotaInternaAction(payload: { documentoId: string; contenido: string }) {
  const result = await apiPost('/notas-internas', {
    documentoId: payload.documentoId,
    texto: payload.contenido,
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

  const data =
    result.data && typeof result.data === 'object'
      ? normalizeNota(result.data as Record<string, unknown>)
      : null

  return { success: true as const, data }
}

export async function deleteNotaInternaAction(notaId: string) {
  const result = await apiDelete(`/notas-internas/${notaId}`)

  if (!result.success) {
    return {
      success: false as const,
      error: result.error,
      details: result.details,
      status: result.status,
      code: result.code,
    }
  }

  return { success: true as const }
}

export async function getDocumentosConNotasAction(): Promise<
  { success: true; data: DocumentoConNotas[] } | ActionError
> {
  const result = await apiGet('/documentos/curador/con-notas')

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      details: result.details,
      status: result.status,
      code: result.code,
    }
  }

  const rawList = normalizeDocumentsList(result.data)
  return {
    success: true,
    data: rawList.map(normalizeDocumentoConNotas),
  }
}
