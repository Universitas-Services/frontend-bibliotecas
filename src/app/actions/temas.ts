'use server'

import { apiPost, apiGet, apiDelete } from '@/lib/api-client'
import {
  normalizeCarpetaInterna,
  mapCarpetasFromApi,
  type CarpetaInterna,
  type Subcarpeta,
  type TemaPrincipal,
} from '@/lib/temas-taxonomy'
import { revalidatePath } from 'next/cache'

export type { CarpetaInterna, Subcarpeta, TemaPrincipal } from '@/lib/temas-taxonomy'

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

export async function getTemasAction(): Promise<TemaPrincipal[]> {
  const result = await apiGet('/admin/storage/temas')

  if (!result.success) {
    console.warn(
      'Error fetching temas from API (posible problema de permisos). El backend debe permitir al CURADOR acceder a GET /admin/storage/temas.',
      result.error,
    )
    return []
  }

  if (Array.isArray(result.data)) {
    return result.data as TemaPrincipal[]
  }

  return []
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

  return mapCarpetasFromApi(result.data)
}

/** Hijos de una carpeta interna (cascada recursiva hasta hoja). */
export async function getCarpetasInternasHijosAction(
  carpetaInternaId: string,
): Promise<CarpetaInterna[]> {
  const result = await apiGet(`/admin/storage/carpeta-interna/${carpetaInternaId}/hijos`)

  if (!result.success) {
    return []
  }

  let carpetas = mapCarpetasFromApi(result.data)

  if (carpetas.length === 0) {
    const detailResult = await apiGet(`/admin/storage/carpeta-interna/${carpetaInternaId}`)
    if (detailResult.success && detailResult.data && typeof detailResult.data === 'object') {
      const detailRecord = detailResult.data as Record<string, unknown>
      carpetas = mapCarpetasFromApi(
        detailRecord.children ??
          detailRecord.hijos ??
          detailRecord.carpetasInternas ??
          detailRecord.carpetasHijas,
      )
    }
  }

  if (
    process.env.NODE_ENV === 'development' &&
    carpetas.length === 0 &&
    result.data != null &&
    result.data !== '' &&
    !(Array.isArray(result.data) && result.data.length === 0)
  ) {
    console.warn(
      `[getCarpetasInternasHijosAction] Respuesta sin carpetas parseables para ${carpetaInternaId}:`,
      result.data,
    )
  }

  return carpetas
}

export async function eliminarTemaAction(temaId: string): Promise<CrearTemaResponse> {
  const result = await apiDelete(`/admin/storage/tema/${temaId}`)

  if (!result.success) {
    return {
      error: result.error,
      details: result.details,
      status: result.status,
      code: result.code,
    }
  }

  revalidatePath('/admin/taxonomia/temas')
  revalidatePath('/curador/nueva-carga')

  return { data: result.data }
}
