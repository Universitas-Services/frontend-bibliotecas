export type TemaAsignado = {
  id: string
  nombre: string
  slug: string
}

export type UserMeResponse = {
  id: string
  email: string
  role: string
  nombre: string | null
  apellido: string | null
  telefono: string | null
  pais: string | null
  consultasRealizadas: number
  temasAsignados: TemaAsignado[]
  /** Indica si el usuario debe cambiar la contraseña temporal (cuando el backend lo exponga). */
  mustChangePassword: boolean
}

function readMustChangePassword(record: Record<string, unknown>): boolean {
  const candidates = [
    record.mustChangePassword,
    record.debeCambiarPassword,
    record.passwordTemporal,
    record.requiereCambioPassword,
  ]

  return candidates.some((value) => value === true || value === 'true' || value === 1)
}

function readNullableString(value: unknown): string | null {
  if (value === null || value === undefined) return null
  const text = String(value).trim()
  return text || null
}

function normalizeTemaAsignado(value: unknown): TemaAsignado | null {
  if (!value || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  const id = readNullableString(record.id)
  const nombre = readNullableString(record.nombre)
  const slug = readNullableString(record.slug)
  if (!id || !nombre || !slug) return null
  return { id, nombre, slug }
}

export function normalizeUserMeResponse(data: unknown): UserMeResponse | null {
  if (!data || typeof data !== 'object') return null

  const record = data as Record<string, unknown>
  const id = readNullableString(record.id)
  const email = readNullableString(record.email)
  const role = readNullableString(record.role)

  if (!id || !email || !role) return null

  const temasRaw = Array.isArray(record.temasAsignados) ? record.temasAsignados : []
  const temasAsignados = temasRaw
    .map(normalizeTemaAsignado)
    .filter((tema): tema is TemaAsignado => tema !== null)

  return {
    id,
    email,
    role,
    nombre: readNullableString(record.nombre),
    apellido: readNullableString(record.apellido),
    telefono: readNullableString(record.telefono),
    pais: readNullableString(record.pais),
    consultasRealizadas:
      typeof record.consultasRealizadas === 'number' && Number.isFinite(record.consultasRealizadas)
        ? record.consultasRealizadas
        : 0,
    temasAsignados,
    mustChangePassword: readMustChangePassword(record),
  }
}
