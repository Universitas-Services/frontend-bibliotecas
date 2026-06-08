'use server'

import { apiPost, apiGet, type ApiErrorCode } from '@/lib/api-client'

export interface CreateMetadataPayload {
  documentoId: string
  temaPrincipal: string
  tipoDocumento: string
  tipoNorma: string
  enteEmisor: string
  fechaPublicacion: string
  numeroGaceta: string
  ambitoTerritorial: 'NACIONAL' | 'ESTADAL'
  pais: string
}

export type CreateMetadataResult =
  | { success: true; data: unknown }
  | { success: false; error: string; details?: string; status?: number; code?: ApiErrorCode }

export async function createMetadataAction(
  payload: CreateMetadataPayload,
): Promise<CreateMetadataResult> {
  const result = await apiPost('/metadatas', payload)

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      details: result.details,
      status: result.status,
      code: result.code,
    }
  }

  return { success: true, data: result.data }
}

export async function getMetadataByDocumentIdAction(documentoId: string) {
  const result = await apiGet(`/metadatas/documento/${documentoId}`)

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      details: result.details,
      status: result.status,
    }
  }

  return { success: true, data: result.data as Record<string, unknown> }
}

export async function getAllMetadatasAction() {
  const result = await apiGet(`/metadatas`)
  return result
}
