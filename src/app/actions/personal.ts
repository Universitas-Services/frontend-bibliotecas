'use server'

import { revalidatePath } from 'next/cache'

import { apiDelete, apiGet, apiPost, type ApiErrorCode } from '@/lib/api-client'
import type { PersonalPorTema, PersonalUsuario } from '@/lib/personal-utils'

function normalizeUsuario(data: Record<string, unknown>): PersonalUsuario {
  const nombre =
    typeof data.nombre === 'string'
      ? data.nombre
      : `${String(data.nombre || '')} ${String(data.apellido || '')}`.trim()

  return {
    id: String(data.id || data._id || data.userId || ''),
    nombre: nombre || String(data.email || 'Usuario'),
    email: typeof data.email === 'string' ? data.email : undefined,
  }
}

function normalizePersonalList(data: unknown): PersonalPorTema[] {
  if (Array.isArray(data)) {
    return data
      .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
      .map((item) => {
        const tema = item.tema as Record<string, unknown> | undefined
        const usuariosRaw = Array.isArray(item.usuarios)
          ? item.usuarios
          : Array.isArray(item.personal)
            ? item.personal
            : []

        return {
          temaId: String(item.temaId || tema?.id || item.id || ''),
          temaNombre:
            typeof item.temaNombre === 'string'
              ? item.temaNombre
              : tema
                ? String(tema.nombre || '')
                : typeof item.nombre === 'string'
                  ? item.nombre
                  : undefined,
          usuarios: usuariosRaw
            .filter((u): u is Record<string, unknown> => !!u && typeof u === 'object')
            .map(normalizeUsuario),
        }
      })
  }

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>
    for (const key of ['data', 'items', 'temas', 'personal']) {
      const value = record[key]
      if (Array.isArray(value)) {
        return normalizePersonalList(value)
      }
    }
  }

  return []
}

type ActionError = {
  success: false
  error: string
  details?: string
  status?: number
  code?: ApiErrorCode
}

export async function getPersonalByTemasAction(): Promise<
  { success: true; data: PersonalPorTema[] } | ActionError
> {
  const result = await apiGet('/users/admin/temas/personal')

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      details: result.details,
      status: result.status,
      code: result.code,
    }
  }

  return { success: true, data: normalizePersonalList(result.data) }
}

export async function asignarPersonalAction(temaId: string, userId: string) {
  const result = await apiPost(`/users/admin/temas/${temaId}/personal/${userId}`, {})

  if (!result.success) {
    return {
      success: false as const,
      error: result.error,
      details: result.details,
      status: result.status,
      code: result.code,
    }
  }

  revalidatePath('/admin/taxonomia/temas')
  return { success: true as const, data: result.data }
}

export async function removerPersonalAction(temaId: string, userId: string) {
  const result = await apiDelete(`/users/admin/temas/${temaId}/personal/${userId}`)

  if (!result.success) {
    return {
      success: false as const,
      error: result.error,
      details: result.details,
      status: result.status,
      code: result.code,
    }
  }

  revalidatePath('/admin/taxonomia/temas')
  return { success: true as const }
}
