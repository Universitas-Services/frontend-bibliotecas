'use server'

import { apiPost, apiGet } from '@/lib/api-client'
import { revalidatePath } from 'next/cache'
import { getTemasPrincipales } from '@/lib/mocks/admin-store'

export interface CrearTemaResponse {
  error?: string
  details?: string
  status?: number
  code?: string
  data?: unknown
}

export async function crearTemaAction(nombreTema: string): Promise<CrearTemaResponse> {
  const result = await apiPost('/admin/storage/tema', { nombreTema })

  if (!result.success) {
    return {
      error: result.error,
      details: result.details,
      status: result.status,
      code: result.code,
    }
  }

  // Revalidar las rutas donde se muestran los temas
  revalidatePath('/admin/taxonomia/temas')
  revalidatePath('/curador/nueva-carga')

  return { data: result.data }
}

export interface TemaPrincipal {
  id: string
  nombre: string
  slug: string
  gcsUri?: string
  createdAt?: string
  updatedAt?: string
  subcarpetas?: unknown[]
}

export async function getTemasAction(): Promise<TemaPrincipal[]> {
  const result = await apiGet('/admin/storage/temas')

  // console.log('getTemasAction API result:', JSON.stringify(result, null, 2))

  if (!result.success) {
    console.warn(
      'Error fetching temas from API (posible problema de permisos). Usando mock data como fallback.',
      result.error,
    )
    return getTemasPrincipales() as unknown as TemaPrincipal[]
  }

  if (Array.isArray(result.data)) {
    return result.data as TemaPrincipal[]
  }

  return getTemasPrincipales() as unknown as TemaPrincipal[]
}
