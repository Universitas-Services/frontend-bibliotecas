'use server'

import { revalidatePath } from 'next/cache'

import { apiDelete, apiGet, apiPatch, apiPost, type ApiErrorCode } from '@/lib/api-client'
import {
  normalizeEtiquetaItem,
  normalizeSugerenciaPendiente,
  normalizeTaxonomiaList,
} from '@/lib/taxonomia-normalize'
import type { EtiquetaItem, SugerenciaPendiente } from '@/lib/types/taxonomia'

const ETIQUETAS_ADMIN_PATH = '/admin/taxonomia/etiquetas'

type ActionFailure = {
  success: false
  error: string
  status?: number
  code?: ApiErrorCode
}

function revalidateEtiquetasAdmin() {
  revalidatePath(ETIQUETAS_ADMIN_PATH)
}

export async function getEtiquetasAprobadasAction(): Promise<EtiquetaItem[]> {
  const result = await apiGet('/etiquetas')
  if (!result.success) return []
  return normalizeTaxonomiaList(result.data).map(normalizeEtiquetaItem)
}

export async function getEtiquetasPendientesAction(): Promise<SugerenciaPendiente[]> {
  const result = await apiGet('/etiquetas/pendientes')
  if (!result.success) return []
  return normalizeTaxonomiaList(result.data).map(normalizeSugerenciaPendiente)
}

export async function createEtiquetaAction(
  _prevState: unknown,
  formData: FormData,
): Promise<{ success: true } | ActionFailure> {
  const nombre = String(formData.get('nombre') ?? '').trim()
  if (!nombre) {
    return { success: false, error: 'El nombre es obligatorio.', status: 400, code: 'HTTP_ERROR' }
  }

  const result = await apiPost('/etiquetas', { nombre })
  if (!result.success) {
    return {
      success: false,
      error: result.error,
      status: result.status,
      code: result.code,
    }
  }

  revalidateEtiquetasAdmin()
  return { success: true }
}

export async function deleteEtiquetaAction(id: string): Promise<{ success: true } | ActionFailure> {
  const trimmed = id.trim()
  if (!trimmed) {
    return { success: false, error: 'Identificador inválido.', status: 400, code: 'HTTP_ERROR' }
  }

  const result = await apiDelete(`/etiquetas/${encodeURIComponent(trimmed)}`)
  if (!result.success) {
    return {
      success: false,
      error: result.error,
      status: result.status,
      code: result.code,
    }
  }

  revalidateEtiquetasAdmin()
  return { success: true }
}

export async function aprobarEtiquetaAction(
  id: string,
): Promise<{ success: true } | ActionFailure> {
  const trimmed = id.trim()
  if (!trimmed) {
    return { success: false, error: 'Identificador inválido.', status: 400, code: 'HTTP_ERROR' }
  }

  const result = await apiPatch(`/etiquetas/${encodeURIComponent(trimmed)}/aprobar`, {})
  if (!result.success) {
    return {
      success: false,
      error: result.error,
      status: result.status,
      code: result.code,
    }
  }

  revalidateEtiquetasAdmin()
  return { success: true }
}

export async function rechazarEtiquetaAction(
  id: string,
): Promise<{ success: true } | ActionFailure> {
  const trimmed = id.trim()
  if (!trimmed) {
    return { success: false, error: 'Identificador inválido.', status: 400, code: 'HTTP_ERROR' }
  }

  const result = await apiPatch(`/etiquetas/${encodeURIComponent(trimmed)}/rechazar`, {})
  if (!result.success) {
    return {
      success: false,
      error: result.error,
      status: result.status,
      code: result.code,
    }
  }

  revalidateEtiquetasAdmin()
  return { success: true }
}
