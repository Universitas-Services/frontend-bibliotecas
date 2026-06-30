'use server'

import { getApiBaseUrl } from '@/lib/api'
import {
  apiGet,
  apiPatchFormData,
  apiPostFormData,
  apiPutFormData,
  getApiErrorMessage,
  getAuthFailure,
  getBearerToken,
  normalizeDocumentsList,
  type ApiErrorCode,
} from '@/lib/api-client'
import { toUserFacingMessage, translateBackendError, USER_MSG } from '@/lib/user-messages'
import type { BackendEstadoLegal } from '@/lib/document-status'

export async function uploadDocumentAction(formData: FormData) {
  const result = await apiPostFormData('/documentos/upload', formData)

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

export async function uploadReformaAction(formData: FormData) {
  const result = await apiPostFormData('/documentos/reforma', formData)

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

export type GetDocumentsResult =
  | { success: true; data: Record<string, unknown>[]; status: number }
  | { success: false; error: string; details?: string; status?: number; code?: ApiErrorCode }

export async function getDocumentsAction(): Promise<GetDocumentsResult> {
  const result = await apiGet('/documentos')

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
    data: normalizeDocumentsList(result.data),
    status: result.status,
  }
}

export async function getPreviewUrlAction(documentId: string) {
  try {
    const token = await getBearerToken()

    if (!token) {
      const failure = await getAuthFailure()
      return { success: false, error: failure.error }
    }

    const res = await fetch(`${getApiBaseUrl()}/documentos/${documentId}/preview`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(120_000),
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      const fallback =
        res.status === 401 ? USER_MSG.common.sessionExpired : USER_MSG.preview.unavailable
      return {
        success: false,
        error: toUserFacingMessage(
          translateBackendError(getApiErrorMessage(data, fallback)),
          fallback,
        ),
      }
    }

    if (!data?.url || typeof data.url !== 'string') {
      return {
        success: false,
        error: USER_MSG.preview.unavailable,
      }
    }

    return { success: true, url: data.url }
  } catch (error) {
    const message =
      error instanceof Error
        ? toUserFacingMessage(error.message, USER_MSG.common.connection)
        : USER_MSG.common.connection
    return { success: false, error: message }
  }
}

export async function getDocumentByIdAction(documentId: string) {
  try {
    const token = await getBearerToken()

    if (!token) {
      const failure = await getAuthFailure()
      return { success: false, error: failure.error }
    }

    const res = await fetch(`${getApiBaseUrl()}/documentos/${documentId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(120_000),
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      const fallback =
        res.status === 401 ? USER_MSG.common.sessionExpired : USER_MSG.error.loadDocument
      return {
        success: false,
        error: toUserFacingMessage(
          translateBackendError(getApiErrorMessage(data, fallback)),
          fallback,
        ),
      }
    }

    return { success: true, data }
  } catch (error) {
    const message =
      error instanceof Error
        ? toUserFacingMessage(error.message, USER_MSG.common.connection)
        : USER_MSG.common.connection
    return { success: false, error: message }
  }
}

export async function deleteDocumentAction(documentId: string) {
  try {
    const token = await getBearerToken()
    if (!token) {
      const failure = await getAuthFailure()
      return { success: false, error: failure.error }
    }

    const res = await fetch(`${getApiBaseUrl()}/documentos/${documentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      return {
        success: false,
        error: toUserFacingMessage(
          translateBackendError(getApiErrorMessage(data, USER_MSG.error.deleteDocument)),
          USER_MSG.error.deleteDocument,
        ),
      }
    }

    return { success: true }
  } catch (error) {
    const message =
      error instanceof Error
        ? toUserFacingMessage(error.message, USER_MSG.common.connection)
        : USER_MSG.common.connection
    return { success: false, error: message }
  }
}

export async function updateDocumentAction(id: string, formData: FormData) {
  const result = await apiPutFormData(`/documentos/editar/${id}`, formData)

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

export async function patchDocumentEstadoLegalAction(id: string, estadoLegal: BackendEstadoLegal) {
  const formData = new FormData()
  formData.set('estadoLegal', estadoLegal)

  const result = await apiPatchFormData(`/documentos/${id}`, formData)

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
