'use server'

import { validateCreateUserInput } from '@/lib/admin-validation'
import {
  createUser,
  getTemasPrincipales,
  getTemaPrincipalById,
  listUsers,
} from '@/lib/mocks/admin-store'
import type { AssignableRole, CreateUserInput } from '@/lib/types/admin'

// TODO(backend): POST /admin/usuarios
// TODO(backend): GET /admin/usuarios
// TODO(backend): GET /taxonomia/temas

export async function listTemasPrincipalesAction() {
  try {
    return { success: true as const, data: getTemasPrincipales() }
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
    const tema = getTemaPrincipalById(input.temaPrincipalId)
    if (!tema) {
      return { success: false as const, error: 'El tema principal seleccionado no es válido.' }
    }
  }

  try {
    const user = createUser({
      nombre: input.nombre.trim(),
      apellido: input.apellido.trim(),
      email: input.email.trim().toLowerCase(),
      rol: input.rol,
      temaPrincipalId: input.rol === 'REVISOR' ? input.temaPrincipalId : undefined,
      password: input.password,
    })

    return { success: true as const, data: user }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al crear el usuario.'
    return { success: false as const, error: message }
  }
}
