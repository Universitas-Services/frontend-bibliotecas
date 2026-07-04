'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { apiGet, apiPatch, apiPost, type ApiErrorCode } from '@/lib/api-client'
import { getApiBaseUrl } from '@/lib/api'
import {
  normalizeCategoriaItem,
  normalizeSugerenciaPendiente,
  normalizeTaxonomiaList,
} from '@/lib/taxonomia-normalize'
import type { CategoriaItem, SugerenciaPendiente } from '@/lib/types/taxonomia'

const CATEGORIAS_ADMIN_PATH = '/admin/taxonomia/categorias'

type ActionFailure = {
  success: false
  error: string
  status?: number
  code?: ApiErrorCode
}

function revalidateCategoriasAdmin() {
  revalidatePath(CATEGORIAS_ADMIN_PATH)
}

async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get('access_token')?.value
}

export async function createCategoriaAction(prevState: unknown, formData: FormData) {
  const token = await getToken()

  if (!token) {
    return { success: false as const, error: 'No autorizado' }
  }

  const descripcion = (formData.get('descripcion') as string)?.trim()
  const payload: Record<string, string> = {
    nombre: formData.get('nombre') as string,
  }
  if (descripcion) {
    payload.descripcion = descripcion
  }

  if (!payload.nombre) {
    return { success: false as const, error: 'El nombre es obligatorio' }
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/categorias/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const resData = await res.json().catch(() => ({}))
      return { success: false as const, error: resData.message || 'Error al crear la categoría' }
    }

    revalidateCategoriasAdmin()
    return { success: true as const, data: await res.json() }
  } catch (error) {
    console.error('Error createCategoriaAction:', error)
    return { success: false as const, error: 'Error de red' }
  }
}

export async function getCategoriasAdmin() {
  const token = await getToken()

  if (!token) {
    return []
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/categorias/admin`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return []
    }

    const data = await res.json()
    const result = normalizeTaxonomiaList(data)

    return JSON.parse(JSON.stringify(result.map(normalizeCategoriaItem)))
  } catch (error) {
    console.error('Error fetching categorias:', error)
    return []
  }
}

export async function getCategoriasAprobadasAction(): Promise<CategoriaItem[]> {
  const result = await apiGet('/categorias')
  if (!result.success) return []
  return normalizeTaxonomiaList(result.data).map(normalizeCategoriaItem)
}

export async function getCategoriasPendientesAction(): Promise<SugerenciaPendiente[]> {
  const result = await apiGet('/categorias/pendientes')
  if (!result.success) return []
  return normalizeTaxonomiaList(result.data).map(normalizeSugerenciaPendiente)
}

export async function sugerirCategoriaAction(
  nombre: string,
  descripcion?: string,
): Promise<{ success: true; data: CategoriaItem } | ActionFailure> {
  const trimmed = nombre.trim()
  if (!trimmed) {
    return { success: false, error: 'El nombre es obligatorio.', status: 400, code: 'HTTP_ERROR' }
  }

  const payload: Record<string, string> = { nombre: trimmed }
  const desc = descripcion?.trim()
  if (desc) payload.descripcion = desc

  const result = await apiPost('/categorias/sugerir', payload)
  if (!result.success) {
    return {
      success: false,
      error: result.error,
      status: result.status,
      code: result.code,
    }
  }

  const data = result.data
  if (!data || typeof data !== 'object') {
    return {
      success: false,
      error: 'Respuesta inválida del servidor.',
      status: 500,
      code: 'HTTP_ERROR',
    }
  }

  return { success: true, data: normalizeCategoriaItem(data as Record<string, unknown>) }
}

export async function aprobarCategoriaAction(
  id: string,
): Promise<{ success: true } | ActionFailure> {
  const trimmed = id.trim()
  if (!trimmed) {
    return { success: false, error: 'Identificador inválido.', status: 400, code: 'HTTP_ERROR' }
  }

  const result = await apiPatch(`/categorias/${encodeURIComponent(trimmed)}/aprobar`, {})
  if (!result.success) {
    return {
      success: false,
      error: result.error,
      status: result.status,
      code: result.code,
    }
  }

  revalidateCategoriasAdmin()
  return { success: true }
}

export async function rechazarCategoriaAction(
  id: string,
): Promise<{ success: true } | ActionFailure> {
  const trimmed = id.trim()
  if (!trimmed) {
    return { success: false, error: 'Identificador inválido.', status: 400, code: 'HTTP_ERROR' }
  }

  const result = await apiPatch(`/categorias/${encodeURIComponent(trimmed)}/rechazar`, {})
  if (!result.success) {
    return {
      success: false,
      error: result.error,
      status: result.status,
      code: result.code,
    }
  }

  revalidateCategoriasAdmin()
  return { success: true }
}
