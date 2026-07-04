import { cookies } from 'next/headers'

import { getApiBaseUrl } from '@/lib/api'
import { isTokenExpired } from '@/lib/auth'
import { ACCESS_TOKEN_COOKIE } from '@/lib/auth-cookies'
import { toUserFacingMessage, translateBackendError, USER_MSG } from '@/lib/user-messages'

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
    return messages
      .map((line) => `• ${toUserFacingMessage(translateBackendError(line))}`)
      .join('\n')
  }

  return undefined
}

function toApiUserError(data: unknown, fallback: string): string {
  return toUserFacingMessage(translateBackendError(getApiErrorMessage(data, fallback)), fallback)
}

export { translateBackendError }

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

function isDocumentLike(item: unknown): item is Record<string, unknown> {
  if (!item || typeof item !== 'object') return false
  const record = item as Record<string, unknown>
  return (
    'id' in record ||
    '_id' in record ||
    'documentoId' in record ||
    'titulo' in record ||
    'tituloIntegro' in record
  )
}

function getDocumentId(doc: Record<string, unknown>): string {
  return String(doc.id ?? doc._id ?? doc.documentoId ?? '')
}

/** Une listas del backend sin duplicar por id. */
export function mergeDocumentsById(
  ...lists: Record<string, unknown>[][]
): Record<string, unknown>[] {
  const byId = new Map<string, Record<string, unknown>>()
  const withoutId: Record<string, unknown>[] = []

  for (const list of lists) {
    for (const doc of list) {
      const id = getDocumentId(doc)
      if (!id) {
        withoutId.push(doc)
        continue
      }

      const previous = byId.get(id)
      byId.set(id, previous ? { ...previous, ...doc } : doc)
    }
  }

  return [...byId.values(), ...withoutId]
}

const DOCUMENT_LIST_KEYS = [
  'data',
  'content',
  'documentos',
  'items',
  'results',
  'docs',
  'payload',
  'rows',
  'records',
  'list',
  'elements',
]

function toDocumentRecords(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return []

  return value.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
}

/** Normaliza listados del backend: array plano o envoltorios paginados (incluye anidados). */
export function normalizeDocumentsList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) {
    return toDocumentRecords(data)
  }

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>
    const arrayResults: Record<string, unknown>[][] = []

    for (const key of DOCUMENT_LIST_KEYS) {
      const value = record[key]
      if (value === undefined || value === null) continue

      if (Array.isArray(value)) {
        const items = toDocumentRecords(value)
        if (items.length > 0) arrayResults.push(items)
        continue
      }

      const nested = normalizeDocumentsList(value)
      if (nested.length > 0) arrayResults.push(nested)
    }

    if (arrayResults.length > 0) {
      return mergeDocumentsById(...arrayResults)
    }

    for (const key of Object.keys(record)) {
      const value = record[key]
      if (Array.isArray(value)) {
        const items = toDocumentRecords(value)
        if (items.length > 0 && items.some(isDocumentLike)) {
          arrayResults.push(items)
        }
      }
    }

    if (arrayResults.length > 0) {
      return mergeDocumentsById(...arrayResults)
    }
  }

  return []
}

export async function getBearerToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value
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
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  if (token && isTokenExpired(token)) {
    return {
      error: USER_MSG.common.sessionExpired,
      status: 401,
      code: 'TOKEN_EXPIRED',
    }
  }

  return {
    error: USER_MSG.common.notAuthorized,
    status: 401,
    code: 'NO_TOKEN',
  }
}

const API_TIMEOUT_MS = 120_000

function getFetchErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return toUserFacingMessage(error.message, USER_MSG.common.connection)
  }
  return USER_MSG.common.connection
}

function defaultFileName(key: string): string {
  if (key === 'gacetaFile') return 'gaceta.pdf'
  if (key === 'file') return 'documento.pdf'
  return 'adjunto.bin'
}

function isNonEmptyBlob(value: FormDataEntryValue | null): value is File {
  return value instanceof Blob && value.size > 0
}

const UPLOAD_FILE_FIELD_ORDER = ['file', 'gacetaFile'] as const

type PendingUploadFile = {
  key: string
  buffer: ArrayBuffer
  name: string
  type: string
}

/**
 * Reconstruye multipart para Node fetch.
 * Multer/Busboy recomienda campos de texto primero y archivos al final.
 */
export async function buildOutboundFormData(source: FormData): Promise<FormData> {
  const outbound = new FormData()
  const textEntries: Array<{ key: string; value: string }> = []
  const fileParts = new Map<string, PendingUploadFile>()

  for (const key of source.keys()) {
    for (const value of source.getAll(key)) {
      if (isNonEmptyBlob(value)) {
        fileParts.set(key, {
          key,
          buffer: await value.arrayBuffer(),
          name: value instanceof File && value.name ? value.name : defaultFileName(key),
          type: value.type || 'application/octet-stream',
        })
        continue
      }

      if (value != null && String(value) !== '') {
        textEntries.push({ key, value: String(value) })
      }
    }
  }

  for (const entry of textEntries) {
    outbound.append(entry.key, entry.value)
  }

  for (const fieldName of UPLOAD_FILE_FIELD_ORDER) {
    const part = fileParts.get(fieldName)
    if (!part) continue
    outbound.append(part.key, new File([part.buffer], part.name, { type: part.type }))
    fileParts.delete(fieldName)
  }

  for (const part of fileParts.values()) {
    outbound.append(part.key, new File([part.buffer], part.name, { type: part.type }))
  }

  return outbound
}

function multipartFetchHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  }
}

type MultipartProxyMethod = 'POST' | 'PUT' | 'PATCH'

function logInboundMultipartHeaders(
  method: MultipartProxyMethod,
  path: string,
  request: Request,
  contentType: string,
): void {
  if (process.env.NODE_ENV !== 'development') return

  const contentLength = request.headers.get('content-length')
  console.log(
    `[API ${method} proxy] ${path} Content-Type: ${contentType}; Content-Length: ${contentLength ?? 'chunked'}`,
  )
}

/**
 * Proxy multipart navegador → backend (Cloud Run).
 * Usa el stream original con duplex: 'half' para no corromper el binario del PDF.
 * El JWT se lee de la cookie httpOnly (el navegador no envía Authorization al proxy).
 */
export async function proxyMultipartToBackend(
  request: Request,
  path: string,
  method: MultipartProxyMethod = 'POST',
): Promise<ApiResult<unknown>> {
  const token = await getBearerToken()

  if (!token) {
    const failure = await getAuthFailure()
    return { success: false, ...failure }
  }

  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.includes('multipart/form-data')) {
    return {
      success: false,
      error: 'La solicitud debe incluir archivos en formato multipart.',
      status: 400,
      code: 'HTTP_ERROR',
    }
  }

  if (!request.body) {
    return {
      success: false,
      error: 'No se recibió el cuerpo de la solicitud.',
      status: 400,
      code: 'HTTP_ERROR',
    }
  }

  logInboundMultipartHeaders(method, path, request, contentType)

  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': contentType,
      },
      body: request.body,
      duplex: 'half',
      cache: 'no-store',
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    } as RequestInit)

    const data = await parseResponseBody(res)

    if (!res.ok) {
      const fallback =
        res.status === 401
          ? 'Sesión no válida o expirada. Inicie sesión nuevamente.'
          : res.status === 400
            ? 'La solicitud no cumple los requisitos del servidor.'
            : 'Error del backend al procesar la solicitud.'

      if (process.env.NODE_ENV === 'development') {
        console.error(`[API ${method} proxy] ${path} → ${res.status}`, data)
      }

      return {
        success: false,
        error: toApiUserError(data, fallback),
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
      console.error(`[API ${method} proxy] ${path} network error`, error)
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

export async function apiPostFormData(path: string, source: FormData): Promise<ApiResult<unknown>> {
  const token = await getBearerToken()

  if (!token) {
    const failure = await getAuthFailure()
    return { success: false, ...failure }
  }

  const file = source.get('file')
  if (!isNonEmptyBlob(file)) {
    return {
      success: false,
      error: 'Debe seleccionar un archivo válido para subir.',
      status: 400,
      code: 'HTTP_ERROR',
    }
  }

  const body = await buildOutboundFormData(source)

  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
      method: 'POST',
      headers: multipartFetchHeaders(token),
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
        error: toApiUserError(data, fallback),
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
        error: toApiUserError(data, fallback),
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

export async function apiDelete(path: string): Promise<ApiResult<unknown>> {
  const token = await getBearerToken()

  if (!token) {
    const failure = await getAuthFailure()
    return { success: false, ...failure }
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    })

    // 204 No Content is a valid success response for DELETE
    if (res.status === 204) {
      return { success: true, data: null, status: 204 }
    }

    const data = await parseResponseBody(res)

    if (!res.ok) {
      const fallback =
        res.status === 401
          ? 'Sesión no válida o expirada. Inicie sesión nuevamente.'
          : res.status === 404
            ? 'El recurso que intenta eliminar no fue encontrado.'
            : 'Error al eliminar el recurso.'

      if (process.env.NODE_ENV === 'development') {
        console.error(`[API DELETE] ${path} → ${res.status}`, data)
      }

      return {
        success: false,
        error: toApiUserError(data, fallback),
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
      console.error(`[API DELETE] ${path} network error`, error)
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
        error: toApiUserError(data, fallback),
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

export async function apiPutFormData(path: string, source: FormData): Promise<ApiResult<unknown>> {
  const token = await getBearerToken()

  if (!token) {
    const failure = await getAuthFailure()
    return { success: false, ...failure }
  }

  const body = await buildOutboundFormData(source)

  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
      method: 'PUT',
      headers: multipartFetchHeaders(token),
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
        console.error(`[API PUT] ${path} → ${res.status}`, data)
      }

      return {
        success: false,
        error: toApiUserError(data, fallback),
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
      console.error(`[API PUT] ${path} network error`, error)
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

export async function apiPatchFormData(
  path: string,
  source: FormData,
): Promise<ApiResult<unknown>> {
  const token = await getBearerToken()

  if (!token) {
    const failure = await getAuthFailure()
    return { success: false, ...failure }
  }

  const body = await buildOutboundFormData(source)

  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
      method: 'PATCH',
      headers: multipartFetchHeaders(token),
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
        console.error(`[API PATCH multipart] ${path} → ${res.status}`, data)
      }

      return {
        success: false,
        error: toApiUserError(data, fallback),
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
      console.error(`[API PATCH multipart] ${path} network error`, error)
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

export async function apiPatch(path: string, body: unknown): Promise<ApiResult<unknown>> {
  const token = await getBearerToken()

  if (!token) {
    const failure = await getAuthFailure()
    return { success: false, ...failure }
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
      method: 'PATCH',
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
        console.error(`[API PATCH] ${path} → ${res.status}`, data)
      }

      return {
        success: false,
        error: toApiUserError(data, fallback),
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
      console.error(`[API PATCH] ${path} network error`, error)
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
