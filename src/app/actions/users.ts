'use server'

import { cookies } from 'next/headers'
import { getApiBaseUrl } from '@/lib/api'

import { validateCreateUserInput } from '@/lib/admin-validation'
import { listUsers } from '@/lib/mocks/admin-store'
import type { AssignableRole, CreateUserInput } from '@/lib/types/admin'

// TODO(backend): POST /admin/usuarios
// TODO(backend): GET /admin/usuarios
// TODO(backend): GET /taxonomia/temas

import { getTemasAction } from '@/app/actions/temas'

export async function listTemasPrincipalesAction() {
  try {
    const temas = await getTemasAction()
    return { success: true as const, data: temas }
  } catch {
    return { success: false as const, error: 'No se pudieron cargar los temas principales.' }
  }
}

export async function listUsersAction() {
  try {
    return { success: true as const, data: listUsers() }
  } catch {
    return { success: false as const, error: 'No se pudieron cargar los usuarios.' }
  }
}

export async function createUserAction(formData: FormData) {
  const input: CreateUserInput = {
    nombre: String(formData.get('nombre') ?? ''),
    apellido: String(formData.get('apellido') ?? ''),
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
    rol: String(formData.get('rol') ?? '') as AssignableRole,
    temaPrincipalId: String(formData.get('temaPrincipalId') ?? '') || undefined,
  }

  const validationError = validateCreateUserInput(input)
  if (validationError) {
    return { success: false as const, error: validationError }
  }

  if (input.rol === 'REVISOR' && input.temaPrincipalId) {
    const temas = await getTemasAction()
    const tema = temas.find((t) => t.id === input.temaPrincipalId)
    if (!tema) {
      return { success: false as const, error: 'El tema principal seleccionado no es válido.' }
    }
  }

  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value

    if (!token) {
      return { success: false as const, error: 'No autorizado. Inicie sesión nuevamente.' }
    }

    const payload = {
      email: input.email.trim().toLowerCase(),
      password: input.password,
      role: input.rol,
      nombre: input.nombre.trim(),
      apellido: input.apellido.trim(),
      temaIds: input.rol === 'REVISOR' && input.temaPrincipalId ? [input.temaPrincipalId] : [],
    }

    const res = await fetch(`${getApiBaseUrl()}/users/admin/staff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      return {
        success: false as const,
        error: data?.message || 'Error al crear el usuario en el servidor.',
      }
    }

    const user = await res.json()
    return { success: true as const, data: user }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false as const, error: 'Error de red al crear el usuario.' }
  }
}
