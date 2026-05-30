import type { UserRole } from '@/lib/auth'

export type AssignableRole = Exclude<UserRole, 'ADMIN'>

export type TemaPrincipal = {
  id: string
  nombre: string
}

export type AdminUser = {
  id: string
  nombre: string
  apellido: string
  email: string
  rol: AssignableRole
  temaPrincipalId?: string
  createdAt: string
}

export type MatrizItem = {
  id: string
  nombre: string
  fileName: string
  version?: string
  uploadedAt: string
}

export type CreateUserInput = {
  nombre: string
  apellido: string
  email: string
  password: string
  rol: AssignableRole
  temaPrincipalId?: string
}
