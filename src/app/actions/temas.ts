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

export async function crearTemaAction(
  nombreTema: string,
  descripcion: string,
): Promise<CrearTemaResponse> {
  const result = await apiPost('/admin/storage/tema', { nombreTema, descripcion })

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

export async function crearTipoDocumentoAction(
  temaId: string,
  tipoDocumento: string,
  descripcion: string,
): Promise<CrearTemaResponse> {
  // El backend lo llama "tipoNorma" pero representa el Nivel 2 (Tipo de documento)
  const result = await apiPost(`/admin/storage/tema/${temaId}/subcarpeta`, {
    tipoNorma: tipoDocumento,
    descripcion,
  })

  if (!result.success) {
    return {
      error: result.error,
      details: result.details,
      status: result.status,
      code: result.code,
    }
  }

  revalidatePath('/admin/taxonomia/tipo-documentos')
  revalidatePath('/admin/taxonomia/tipo-normas')
  revalidatePath('/curador/nueva-carga')

  return { data: result.data }
}

export async function crearTipoNormaAction(
  subcarpetaId: string,
  nombreCarpeta: string,
  descripcion: string,
): Promise<CrearTemaResponse> {
  // El backend lo llama "nombreCarpeta" y representa el Nivel 3 (Tipo de norma)
  const result = await apiPost(`/admin/storage/subcarpeta/${subcarpetaId}/carpeta-interna`, {
    nombreCarpeta,
    descripcion,
  })

  if (!result.success) {
    return {
      error: result.error,
      details: result.details,
      status: result.status,
      code: result.code,
    }
  }

  revalidatePath('/admin/taxonomia/tipo-normas')
  revalidatePath('/curador/nueva-carga')

  return { data: result.data }
}

export interface CarpetaInterna {
  id: string
  nombreCarpeta: string
  slug: string
  gcsUri?: string
  createdAt?: string
  updatedAt?: string
}

export interface Subcarpeta {
  id: string
  tipoNorma: string // Nombre del tipo de documento
  slug: string
  gcsUri?: string
  createdAt?: string
  updatedAt?: string
  carpetasInternas?: CarpetaInterna[]
}

export interface TemaPrincipal {
  id: string
  nombre: string
  slug: string
  gcsUri?: string
  createdAt?: string
  updatedAt?: string
  subcarpetas?: Subcarpeta[]
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

export async function getTiposDocumentoAction(temaId: string): Promise<Subcarpeta[]> {
  const result = await apiGet(`/admin/storage/tema/${temaId}/subcarpetas`)

  if (!result.success) {
    return []
  }

  if (Array.isArray(result.data)) {
    return result.data as Subcarpeta[]
  }

  return []
}

export async function getTiposNormaAction(subcarpetaId: string): Promise<CarpetaInterna[]> {
  const result = await apiGet(`/admin/storage/subcarpeta/${subcarpetaId}/carpetas-internas`)

  if (!result.success) {
    return []
  }

  if (Array.isArray(result.data)) {
    return result.data as CarpetaInterna[]
  }

  return []
}
