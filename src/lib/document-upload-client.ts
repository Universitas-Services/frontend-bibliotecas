import type { ApiErrorCode } from '@/lib/api-client'
import { USER_MSG } from '@/lib/user-messages'
import {
  getTotalFormDataUploadBytes,
  getUploadSizeErrorMessage,
  isWithinUploadLimit,
} from '@/lib/upload-limits'

export type DocumentUploadClientResult = {
  success?: boolean
  data?: unknown
  error?: string
  details?: string
  status?: number
  code?: ApiErrorCode
}

type UploadAuthSuccess = {
  token: string
  baseUrl: string
}

const UPLOAD_AUTH_PATH = '/api/documentos/upload-auth'

function parseBackendUploadError(
  data: Record<string, unknown>,
  status: number,
): Pick<DocumentUploadClientResult, 'error' | 'details'> {
  if (typeof data.error === 'string') {
    return {
      error: data.error,
      details: typeof data.details === 'string' ? data.details : undefined,
    }
  }

  const message = data.message
  if (typeof message === 'string') {
    return { error: message }
  }
  if (Array.isArray(message)) {
    return { error: message.map(String).join(', ') }
  }

  if (status === 413) {
    return { error: USER_MSG.validation.fileTooLarge }
  }

  return { error: USER_MSG.error.uploadDocument }
}

function isUploadAuthSuccess(value: unknown): value is UploadAuthSuccess {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return typeof record.token === 'string' && typeof record.baseUrl === 'string'
}

async function getUploadAuth(): Promise<UploadAuthSuccess | DocumentUploadClientResult> {
  try {
    const res = await fetch(UPLOAD_AUTH_PATH, {
      method: 'GET',
      credentials: 'same-origin',
      cache: 'no-store',
    })
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>

    if (!res.ok) {
      return {
        error: typeof data.error === 'string' ? data.error : USER_MSG.common.notAuthorized,
        status: res.status,
        code: typeof data.code === 'string' ? (data.code as ApiErrorCode) : undefined,
      }
    }

    if (!isUploadAuthSuccess(data)) {
      return {
        error: USER_MSG.common.unknown,
        status: 500,
      }
    }

    return data
  } catch {
    return {
      error: USER_MSG.common.connection,
      status: 0,
    }
  }
}

function validateUploadSize(formData: FormData): DocumentUploadClientResult | null {
  const totalBytes = getTotalFormDataUploadBytes(formData)
  if (totalBytes === 0) return null
  if (isWithinUploadLimit(totalBytes)) return null

  return {
    error: getUploadSizeErrorMessage(totalBytes),
    status: 413,
  }
}

async function directMultipart(
  backendPath: string,
  method: 'POST' | 'PUT',
  formData: FormData,
  options: { requireFile?: boolean } = {},
): Promise<DocumentUploadClientResult> {
  const { requireFile = false } = options

  if (requireFile) {
    const file = formData.get('file')
    if (!(file instanceof Blob) || file.size === 0) {
      return {
        error: 'No se detectó el archivo PDF en el envío. Vuelva a seleccionarlo.',
        status: 400,
      }
    }
  }

  const sizeError = validateUploadSize(formData)
  if (sizeError) return sizeError

  const auth = await getUploadAuth()
  if (!isUploadAuthSuccess(auth)) {
    return auth
  }

  const url = `${auth.baseUrl.replace(/\/$/, '')}${backendPath}`

  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${auth.token}`,
        Accept: 'application/json',
      },
      body: formData,
    })

    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>

    if (res.ok) {
      return { success: true, data }
    }

    const parsed = parseBackendUploadError(data, res.status)
    return {
      ...parsed,
      status: res.status,
      code: res.status === 401 ? 'TOKEN_EXPIRED' : undefined,
    }
  } catch {
    return {
      error: USER_MSG.error.uploadCorsOrNetwork,
      status: 0,
    }
  }
}

export function uploadDocumentClient(formData: FormData) {
  return directMultipart('/documentos/upload', 'POST', formData, { requireFile: true })
}

export function uploadBorradorClient(formData: FormData) {
  return directMultipart('/documentos/borrador', 'POST', formData, { requireFile: true })
}

export function uploadReformaClient(formData: FormData) {
  return directMultipart('/documentos/reforma', 'POST', formData, { requireFile: true })
}

export function updateDocumentClient(id: string, formData: FormData) {
  return directMultipart(`/documentos/editar/${encodeURIComponent(id)}`, 'PUT', formData, {
    requireFile: false,
  })
}
