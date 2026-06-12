import type { TemaAsignado, UserMeResponse } from '@/lib/types/user-profile'

export type SessionUser = {
  id: string
  nombre: string
  apellido: string
  email: string
  role: string
  initials: string
  telefono?: string | null
  pais?: string | null
  consultasRealizadas?: number
  temasAsignados?: TemaAsignado[]
  mustChangePassword?: boolean
}

export type GetSessionUserResult = {
  user: SessionUser | null
  sessionInvalid: boolean
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function resolveDisplayNames(
  nombre: string | null | undefined,
  apellido: string | null | undefined,
  email: string,
): { nombre: string; apellido: string } {
  const trimmedNombre = readString(nombre)
  const trimmedApellido = readString(apellido)

  if (trimmedNombre) {
    return { nombre: trimmedNombre, apellido: trimmedApellido }
  }

  const emailLocal = email.split('@')[0]?.trim()
  if (emailLocal) {
    return { nombre: emailLocal, apellido: '' }
  }

  return { nombre: 'Usuario', apellido: '' }
}

export function buildInitials(nombre: string, apellido: string): string {
  return `${nombre.charAt(0)}${apellido.charAt(0) || nombre.charAt(1) || ''}`
    .toUpperCase()
    .slice(0, 2)
}

export function mapMeToSessionUser(profile: UserMeResponse): SessionUser {
  const { nombre, apellido } = resolveDisplayNames(profile.nombre, profile.apellido, profile.email)

  return {
    id: profile.id,
    nombre,
    apellido,
    email: profile.email,
    role: profile.role,
    initials: buildInitials(nombre, apellido),
    telefono: profile.telefono,
    pais: profile.pais,
    consultasRealizadas: profile.consultasRealizadas,
    temasAsignados: profile.temasAsignados,
    mustChangePassword: profile.mustChangePassword,
  }
}

export function formatSessionDisplayName(user: SessionUser | null | undefined): string {
  if (!user) return 'Usuario'
  return `${user.nombre}${user.apellido ? ` ${user.apellido}` : ''}`.trim() || user.email
}

export function formatDocumentDate(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) {
    return 'Sin fecha'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getDocumentTimestamp(doc: Record<string, unknown> | null | undefined): string {
  if (!doc) return 'Sin fecha'

  const raw =
    readString(doc.ultimaActualizacion) || readString(doc.updatedAt) || readString(doc.createdAt)

  return formatDocumentDate(raw)
}
