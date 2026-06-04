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
  correo: string
  rol: AssignableRole
  temasPrincipales?: {
    id: string
    nombre: string
    slug: string
  }[]
}

export type PaginatedUsersResponse = {
  items: AdminUser[]
  total: number
  page: number
  limit: number
  totalPages: number
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
  temaIds?: string[]
}
