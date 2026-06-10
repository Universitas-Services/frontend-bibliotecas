export type PersonalUsuario = {
  id: string
  nombre: string
  email?: string
}

export type PersonalPorTema = {
  temaId: string
  temaNombre?: string
  usuarios: PersonalUsuario[]
}

type UsuarioConTemas = {
  id: string
  nombre: string
  apellido?: string
  correo?: string
  email?: string
  rol?: string
  temasPrincipales?: { id: string; nombre: string }[]
}

/** Invierte temasPrincipales de usuarios CURADOR/REVISOR en mapa temaId → usuarios. */
export function buildPersonalFromUsers(users: UsuarioConTemas[]): Map<string, PersonalUsuario[]> {
  const map = new Map<string, PersonalUsuario[]>()

  for (const user of users) {
    if (user.rol && user.rol !== 'CURADOR' && user.rol !== 'REVISOR') continue

    const nombre = `${user.nombre || ''} ${user.apellido || ''}`.trim()
    const email = user.correo || user.email

    for (const tema of user.temasPrincipales || []) {
      const existing = map.get(tema.id) || []
      if (!existing.some((u) => u.id === user.id)) {
        existing.push({
          id: user.id,
          nombre: nombre || email || 'Usuario',
          email,
        })
      }
      map.set(tema.id, existing)
    }
  }

  return map
}

/** Combina asignaciones del endpoint personal y las de creación de usuarios. */
export function mergePersonalMaps(
  fromApi: PersonalPorTema[],
  fromUsers: Map<string, PersonalUsuario[]>,
  temas: { id: string; nombre: string }[],
): Map<string, PersonalUsuario[]> {
  const merged = new Map<string, PersonalUsuario[]>()

  for (const [temaId, usuarios] of fromUsers) {
    merged.set(temaId, [...usuarios])
  }

  for (const entry of fromApi) {
    const temaId = entry.temaId || temas.find((t) => t.nombre === entry.temaNombre)?.id || ''
    if (!temaId) continue

    const existing = merged.get(temaId) || []
    for (const usuario of entry.usuarios) {
      if (!existing.some((u) => u.id === usuario.id)) {
        existing.push(usuario)
      }
    }
    merged.set(temaId, existing)
  }

  return merged
}
