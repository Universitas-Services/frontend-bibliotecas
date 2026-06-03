import { cookies } from 'next/headers'

import { getApiBaseUrl } from '@/lib/api'
import { isTokenExpired } from '@/lib/auth'

export type ApiErrorCode = 'NO_TOKEN' | 'TOKEN_EXPIRED' | 'HTTP_ERROR' | 'NETWORK_ERROR'

export type ApiResult<T> =
  | { success: true; data: T; status: number }
  | {
      success: false
      error: string
      details?: string
      status?: number
      code: ApiErrorCode
      raw?: unknown
    }

function collectValidationMessages(data: Record<string, unknown>): string[] {
  const messages: string[] = []

  const push = (value: unknown) => {
    if (typeof value === 'string' && value.trim()) {
      messages.push(value.trim())
    }
  }

  const message = data.message
  if (Array.isArray(message)) {
    message.forEach(push)
  } else {
    push(message)
  }

  if (Array.isArray(data.errors)) {
    for (const item of data.errors) {
      if (typeof item === 'string') {
        push(item)
      } else if (item && typeof item === 'object') {
        const entry = item as Record<string, unknown>
        push(entry.message)
        push(entry.defaultMessage)
        push(entry.error)
      }
    }
  }

  return messages
}

export function getApiErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== 'object') {
    return fallback
  }

  const record = data as Record<string, unknown>
  const validationMessages = collectValidationMessages(record)

  if (validationMessages.length > 0) {
    return validationMessages.join(' ')
  }

  pushString(record.detail, validationMessages)
  if (validationMessages.length > 0) {
    return validationMessages.join(' ')
  }

  const errorText = typeof record.error === 'string' ? record.error.trim() : ''
  if (errorText && errorText !== 'Bad Request') {
    return errorText
  }

  return fallback
}

function pushString(value: unknown, target: string[]) {
  if (typeof value === 'string' && value.trim()) {
    target.push(value.trim())
  }
}

export function getApiErrorDetails(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') {
    return undefined
  }

  const record = data as Record<string, unknown>
  const messages = collectValidationMessages(record)

  if (messages.length > 1) {
    return messages.map((line) => `• ${line}`).join('\n')
  }

  if (typeof record.statusCode === 'number') {
    return `Código HTTP: ${record.statusCode}`
  }

  return undefined
}

async function parseResponseBody(res: Response): Promise<unknown> {
  if (typeof res.text === 'function') {
    const text = await res.text()
    if (!text.trim()) {
      return null
    }

    try {
      return JSON.parse(text) as unknown
    } catch {
      return { message: text }
    }
  }

  if (typeof res.json === 'function') {
    return res.json().catch(() => null)
  }

  return null
}

/** Normaliza listados del backend: array plano o envoltorios paginados. */
export function normalizeDocumentsList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) {
    return data.filter(
      (item): item is Record<string, unknown> => !!item && typeof item === 'object',
    )
  }

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>
    const knownKeys = ['data', 'content', 'documentos', 'items', 'results', 'docs', 'payload']

    for (const key of knownKeys) {
      const value = record[key]
      if (Array.isArray(value)) {
        return value.filter(
          (item): item is Record<string, unknown> => !!item && typeof item === 'object',
        )
      }
    }

    for (const key of Object.keys(record)) {
      const value = record[key]
      if (Array.isArray(value)) {
        return value.filter(
          (item): item is Record<string, unknown> => !!item && typeof item === 'object',
        )
      }
    }
  }

  return []
}

export async function getBearerToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  if (!token || isTokenExpired(token)) {
    return null
  }
  return token
}

export async function getAuthFailure(): Promise<{
  error: string
  status: number
  code: ApiErrorCode
}> {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (token && isTokenExpired(token)) {
    return {
      error: 'Su sesión ha expirado. Inicie sesión nuevamente.',
      status: 401,
      code: 'TOKEN_EXPIRED',
    }
  }

  return {
    error: 'No autorizado. Inicie sesión nuevamente.',
    status: 401,
    code: 'NO_TOKEN',
  }
}

const API_TIMEOUT_MS = 120_000

function getFetchErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }
  return 'No se pudo contactar al servidor.'
}

/** Reconstruye multipart para Node fetch (evita pérdida de nombre/tipo del archivo). */
export function buildOutboundFormData(source: FormData): FormData {
  const outbound = new FormData()
  for (const [key, value] of source.entries()) {
    if (typeof value === 'object' && value !== null && 'size' in value) {
      const fileName =
        'name' in value && typeof value.name === 'string' && value.name
          ? value.name
          : 'documento.pdf'
      outbound.append(key, value, fileName)
    } else if (value != null && value !== '') {
      outbound.append(key, String(value))
    }
  }

  return outbound
}

export async function apiPostFormData(path: string, source: FormData): Promise<ApiResult<unknown>> {
  const token = await getBearerToken()

  if (!token) {
    const failure = await getAuthFailure()
    return { success: false, ...failure }
  }

  const file = source.get('file')
  if (!file || typeof file !== 'object' || !('size' in file) || file.size === 0) {
    return {
      success: false,
      error: 'Debe seleccionar un archivo válido para subir.',
      status: 400,
      code: 'HTTP_ERROR',
    }
  }

  const body = buildOutboundFormData(source)

  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    })

    const data = await parseResponseBody(res)

    if (!res.ok) {
      const fallback =
        res.status === 401
          ? 'Sesión no válida o expirada. Inicie sesión nuevamente.'
          : res.status === 400
            ? 'La solicitud no cumple los requisitos del servidor.'
            : 'Error del backend al procesar la solicitud.'

      if (process.env.NODE_ENV === 'development') {
        console.error(`[API POST] ${path} → ${res.status}`, data)
      }

      return {
        success: false,
        error: getApiErrorMessage(data, fallback),
        details: getApiErrorDetails(data),
        status: res.status,
        code: res.status === 401 ? 'TOKEN_EXPIRED' : 'HTTP_ERROR',
        raw: data,
      }
    }

    return { success: true, data, status: res.status }
  } catch (error) {
    const detail = getFetchErrorMessage(error)
    const isTimeout = error instanceof Error && error.name === 'TimeoutError'

    if (process.env.NODE_ENV === 'development') {
      console.error(`[API POST] ${path} network error`, error)
    }

    return {
      success: false,
      error: isTimeout
        ? 'El servidor tardó demasiado en responder. Intente de nuevo en unos segundos.'
        : `Error de conexión con el servidor. ${detail}`,
      code: 'NETWORK_ERROR',
    }
  }
}

export async function apiGet(path: string): Promise<ApiResult<unknown>> {
  const token = await getBearerToken()

  if (!token) {
    const failure = await getAuthFailure()
    return { success: false, ...failure }
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    })

    const data = await parseResponseBody(res)

    if (!res.ok) {
      const fallback =
        res.status === 401
          ? 'Sesión no válida o expirada. Inicie sesión nuevamente.'
          : 'Error en la solicitud al servidor.'

      if (process.env.NODE_ENV === 'development') {
        console.error(`[API GET] ${path} → ${res.status}`, data)
      }

      return {
        success: false,
        error: getApiErrorMessage(data, fallback),
        details: getApiErrorDetails(data),
        status: res.status,
        code: res.status === 401 ? 'TOKEN_EXPIRED' : 'HTTP_ERROR',
        raw: data,
      }
    }

    return { success: true, data, status: res.status }
  } catch (error) {
    const detail = getFetchErrorMessage(error)
    const isTimeout = error instanceof Error && error.name === 'TimeoutError'

    return {
      success: false,
      error: isTimeout
        ? 'El servidor tardó demasiado en responder. Intente de nuevo en unos segundos.'
        : `Error de conexión con el servidor. ${detail}`,
      code: 'NETWORK_ERROR',
    }
  }
}

export async function apiPost(path: string, body: unknown): Promise<ApiResult<unknown>> {
  const token = await getBearerToken()

  if (!token) {
    const failure = await getAuthFailure()
    return { success: false, ...failure }
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    })

    const data = await parseResponseBody(res)

    if (!res.ok) {
      const fallback =
        res.status === 401
          ? 'Sesión no válida o expirada. Inicie sesión nuevamente.'
          : res.status === 400
            ? 'La solicitud no cumple los requisitos del servidor.'
            : 'Error del backend al procesar la solicitud.'

      if (process.env.NODE_ENV === 'development') {
        console.error(`[API POST JSON] ${path} → ${res.status}`, data)
      }

      return {
        success: false,
        error: getApiErrorMessage(data, fallback),
        details: getApiErrorDetails(data),
        status: res.status,
        code: res.status === 401 ? 'TOKEN_EXPIRED' : 'HTTP_ERROR',
        raw: data,
      }
    }

    return { success: true, data, status: res.status }
  } catch (error) {
    const detail = getFetchErrorMessage(error)
    const isTimeout = error instanceof Error && error.name === 'TimeoutError'

    if (process.env.NODE_ENV === 'development') {
      console.error(`[API POST JSON] ${path} network error`, error)
    }

    return {
      success: false,
      error: isTimeout
        ? 'El servidor tardó demasiado en responder. Intente de nuevo en unos segundos.'
        : `Error de conexión con el servidor. ${detail}`,
      code: 'NETWORK_ERROR',
    }
  }
}
