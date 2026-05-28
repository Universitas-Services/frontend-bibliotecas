'use server'

import { cookies } from 'next/headers'
import { getApiBaseUrl } from '@/lib/api'

export async function listMatrizAAction() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false as const, error: 'No autorizado' }
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/matrices/a`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    if (!res.ok) {
      return { success: false as const, error: 'Error al cargar Matriz A' }
    }

    const data = await res.json()
    return { success: true as const, data: Array.isArray(data) ? data : data.data || [] }
  } catch {
    return { success: false as const, error: 'No se pudo cargar la Matriz A.' }
  }
}

export async function listMatrizBAction() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false as const, error: 'No autorizado' }
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/matrices/b`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    if (!res.ok) {
      return { success: false as const, error: 'Error al cargar Matriz B' }
    }

    const data = await res.json()
    return { success: true as const, data: Array.isArray(data) ? data : data.data || [] }
  } catch {
    return { success: false as const, error: 'No se pudo cargar la Matriz B.' }
  }
}

export async function createMatrizAAction(prevState: unknown, formData: FormData) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false as const, error: 'No autorizado' }
  }

  const newFormData = new FormData()
  newFormData.append('nombreProducto', formData.get('nombreProducto') as string)
  newFormData.append('tipoSolucion', formData.get('tipoSolucion') as string)
  newFormData.append('urlDestino', formData.get('urlDestino') as string)

  // Algunos backends fallan al parsear 'true'/'false' y prefieren '1'/'0' o que simplemente no se envíe si es falso.
  // Vamos a enviar 'true' o 'false' pero también nos aseguraremos del formato.
  newFormData.append('activo', formData.get('activo') as string)

  const file = formData.get('imagenBanner')
  if (file && file instanceof File) {
    newFormData.append('imagenBanner', file, file.name)
  }

  const catsString = formData.get('categorias') as string
  if (catsString) {
    const cats = catsString
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)
    cats.forEach((c) => newFormData.append('categoriasKeywords', c))
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/matrices/a`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: newFormData,
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      return { success: false as const, error: data.message || 'Error al crear en Matriz A' }
    }

    return { success: true as const, data: await res.json() }
  } catch (error) {
    console.error('Error createMatrizAAction:', error)
    return { success: false as const, error: 'Error de red' }
  }
}

export async function createMatrizBAction(prevState: unknown, formData: FormData) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false as const, error: 'No autorizado' }
  }

  const payload: Record<string, unknown> = {
    tituloArticulo: formData.get('tituloArticulo') as string,
    autorArticulo: formData.get('autorArticulo') as string,
    urlDestinoAgora: formData.get('urlDestinoAgora') as string,
    activo: formData.get('activo') === 'true',
    categoriasKeywords: [] as string[],
  }

  const catsString = formData.get('categorias') as string
  if (catsString) {
    payload.categoriasKeywords = catsString
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/matrices/b`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const resData = await res.json().catch(() => ({}))
      return { success: false as const, error: resData.message || 'Error al crear en Matriz B' }
    }

    return { success: true as const, data: await res.json() }
  } catch (error) {
    console.error('Error createMatrizBAction:', error)
    return { success: false as const, error: 'Error de red' }
  }
}
