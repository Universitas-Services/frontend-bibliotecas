'use server'

import { cookies } from 'next/headers'
import { getApiBaseUrl } from '@/lib/api'

export async function createCategoriaAction(prevState: unknown, formData: FormData) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false as const, error: 'No autorizado' }
  }

  const payload = {
    nombre: formData.get('nombre') as string,
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

    return { success: true as const, data: await res.json() }
  } catch (error) {
    console.error('Error createCategoriaAction:', error)
    return { success: false as const, error: 'Error de red' }
  }
}

export async function getCategoriasAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

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
    const result = Array.isArray(data) ? data : data.data || []

    return JSON.parse(JSON.stringify(result))
  } catch (error) {
    console.error('Error fetching categorias:', error)
    return []
  }
}
