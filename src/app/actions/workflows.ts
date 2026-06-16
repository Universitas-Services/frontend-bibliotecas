'use server'

import { apiGet, apiPost, normalizeDocumentsList } from '@/lib/api-client'
import { revalidatePath } from 'next/cache'

export async function rechazarDocumentoAction(documentoId: string, motivo: string) {
  const result = await apiPost(`/workflows/rechazar/${documentoId}`, { motivo })

  if (!result.success) {
    return { success: false, error: result.error, details: result.details }
  }

  revalidatePath('/revisor')
  revalidatePath('/curador/gestion-documental')

  return { success: true, data: result.data }
}

export async function aprobarDocumentoAction(documentoId: string) {
  const result = await apiPost(`/workflows/publicar/${documentoId}`, {})

  if (!result.success) {
    return { success: false, error: result.error, details: result.details }
  }

  revalidatePath('/revisor')
  revalidatePath('/curador/gestion-documental')

  return { success: true, data: result.data }
}

export async function getBandejaRevisorAction() {
  const result = await apiGet('/workflows/bandeja')

  if (!result.success) {
    return { success: false, error: result.error, details: result.details }
  }

  const documents = normalizeDocumentsList(result.data)
  return { success: true, data: documents }
}
