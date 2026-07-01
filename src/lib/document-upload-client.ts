import type { ApiErrorCode } from '@/lib/api-client'

export type DocumentUploadClientResult = {
  success?: boolean
  data?: unknown
  error?: string
  details?: string
  status?: number
  code?: ApiErrorCode
}

async function postMultipart(
  path: string,
  formData: FormData,
): Promise<DocumentUploadClientResult> {
  const file = formData.get('file')
  if (!(file instanceof Blob) || file.size === 0) {
    return {
      error: 'No se detectó el archivo PDF en el envío. Vuelva a seleccionarlo.',
      status: 400,
    }
  }

  const res = await fetch(path, { method: 'POST', body: formData })
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>

  if (res.ok) {
    return { success: true, data }
  }

  return {
    error: typeof data.error === 'string' ? data.error : 'Error al procesar la solicitud.',
    details: typeof data.details === 'string' ? data.details : undefined,
    status: res.status,
    code: typeof data.code === 'string' ? (data.code as ApiErrorCode) : undefined,
  }
}

async function putMultipart(path: string, formData: FormData): Promise<DocumentUploadClientResult> {
  const res = await fetch(path, { method: 'PUT', body: formData })
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>

  if (res.ok) {
    return { success: true, data }
  }

  return {
    error: typeof data.error === 'string' ? data.error : 'Error al procesar la solicitud.',
    details: typeof data.details === 'string' ? data.details : undefined,
    status: res.status,
    code: typeof data.code === 'string' ? (data.code as ApiErrorCode) : undefined,
  }
}

export function uploadDocumentClient(formData: FormData) {
  return postMultipart('/api/documentos/upload', formData)
}

export function uploadBorradorClient(formData: FormData) {
  return postMultipart('/api/documentos/borrador', formData)
}

export function uploadReformaClient(formData: FormData) {
  return postMultipart('/api/documentos/reforma', formData)
}

export function updateDocumentClient(id: string, formData: FormData) {
  return putMultipart(`/api/documentos/editar/${encodeURIComponent(id)}`, formData)
}
