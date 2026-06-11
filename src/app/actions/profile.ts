'use server'

import { apiGet } from '@/lib/api-client'
import { normalizeUserMeResponse, type UserMeResponse } from '@/lib/types/user-profile'

export type GetUserMeResult =
  | { success: true; data: UserMeResponse }
  | { success: false; sessionInvalid: true }
  | { success: false; error: string }

export async function getUserMeAction(): Promise<GetUserMeResult> {
  const result = await apiGet('/users/me')

  if (!result.success) {
    if (result.status === 401 || result.status === 404) {
      return { success: false, sessionInvalid: true }
    }

    return {
      success: false,
      error: result.error || 'No se pudo cargar el perfil del usuario.',
    }
  }

  const profile = normalizeUserMeResponse(result.data)
  if (!profile) {
    return {
      success: false,
      error: 'La respuesta del perfil no tiene el formato esperado.',
    }
  }

  return { success: true, data: profile }
}
